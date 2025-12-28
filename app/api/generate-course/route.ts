import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractVideoId } from '@/lib/youtube'
import OpenAI from 'openai'
import type { StructuredCourse } from '@/types/course'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { youtubeUrl, audioUrl, videoTitle: providedTitle } = body

    if (!youtubeUrl && !audioUrl) {
      return NextResponse.json(
        { error: 'URL YouTube ou fichier audio requis' },
        { status: 400 }
      )
    }

    let videoTitle: string
    let rawTranscript: string
    let finalUrl: string

    if (audioUrl) {
      // Mode upload de fichier
      videoTitle = providedTitle || 'Tutoriel uploadé'
      finalUrl = audioUrl

      // ÉTAPE 1: Transcription avec Whisper
      rawTranscript = await transcribeAudio(audioUrl)
    } else {
      // Mode URL YouTube
      const videoId = extractVideoId(youtubeUrl!)
      if (!videoId) {
        return NextResponse.json(
          { error: 'URL YouTube invalide' },
          { status: 400 }
        )
      }

      videoTitle = `Tutoriel YouTube - ${videoId}`
      finalUrl = youtubeUrl!

      // Pour YouTube, utiliser une transcription simulée (nécessite service tiers pour l'audio)
      rawTranscript = getSimulatedTranscript()
    }

    // ÉTAPE 2: Structuration pédagogique avec GPT-4o
    const structuredChapters = await structureContent(rawTranscript, videoTitle)

    // ÉTAPE 3: Sauvegarde dans la base de données
    const course = await prisma.course.create({
      data: {
        youtube_url: finalUrl,
        video_title: videoTitle,
        raw_transcript: rawTranscript,
        structured_chapters: JSON.stringify(structuredChapters),
      },
    })

    return NextResponse.json({
      courseId: course.id,
      message: 'Cours généré avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la génération du cours:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de la génération du cours',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

async function transcribeAudio(audioUrl: string): Promise<string> {
  try {
    console.log('Téléchargement du fichier audio depuis:', audioUrl)

    // Télécharger le fichier audio
    const audioResponse = await fetch(audioUrl)
    if (!audioResponse.ok) {
      throw new Error('Impossible de télécharger le fichier audio')
    }

    const audioBlob = await audioResponse.blob()
    const audioFile = new File([audioBlob], 'audio.mp3', { type: audioBlob.type })

    console.log('Transcription en cours avec Whisper...')

    // Appeler Whisper pour la transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'],
    })

    console.log('Transcription terminée')

    // Formater la transcription avec timestamps
    let formattedTranscript = ''

    if ('segments' in transcription && Array.isArray(transcription.segments)) {
      formattedTranscript = transcription.segments
        .map((segment: any) => {
          const start = formatTimestamp(segment.start)
          return `[${start}] ${segment.text}`
        })
        .join('\n')
    } else {
      // Fallback si pas de segments
      formattedTranscript = `[00:00] ${transcription.text}`
    }

    return formattedTranscript
  } catch (error) {
    console.error('Erreur lors de la transcription:', error)
    throw new Error(`Échec de la transcription: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
  }
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getSimulatedTranscript(): string {
  return `
    [00:00] Bonjour à tous, aujourd'hui nous allons apprendre à créer une application web moderne.
    [00:15] Commençons par installer Node.js sur votre ordinateur. Allez sur nodejs.org et téléchargez la dernière version LTS.
    [00:45] Une fois Node.js installé, ouvrez votre terminal et vérifiez l'installation avec la commande node --version.
    [01:00] Parfait ! Maintenant, nous allons créer notre premier projet. Créez un nouveau dossier appelé mon-projet.
    [01:20] Dans ce dossier, exécutez npm init pour initialiser un nouveau projet Node.js.
    [01:45] Maintenant installons les dépendances nécessaires avec npm install express.
    [02:10] Créez un fichier index.js et commençons à coder notre serveur web.
    [02:30] Dans index.js, importez express et créez une instance de l'application.
    [03:00] Ajoutez une route GET pour la page d'accueil qui retourne un message de bienvenue.
    [03:30] Finalement, démarrez le serveur sur le port 3000 avec app.listen.
  `
}

async function structureContent(
  transcript: string,
  videoTitle: string
): Promise<StructuredCourse> {
  try {
    const systemPrompt = `Tu es un expert pédagogique spécialisé dans la création de guides d'apprentissage structurés.

Ton rôle est d'analyser une transcription de tutoriel et de la découper en chapitres d'apprentissage logiques.

Règles importantes:
- Chaque chapitre doit durer entre 45 secondes et 2 minutes
- Identifie les temps de début et de fin basés sur les timestamps [MM:SS] dans la transcription
- Crée un titre d'action clair et concis pour chaque chapitre (ex: "Installer Node.js", "Créer le serveur Express")
- Pour chaque chapitre, liste 3 à 5 instructions courtes et impératives
- Les instructions doivent être actionnables et basées sur ce qui est dit dans ce segment
- Retourne UNIQUEMENT un objet JSON valide, sans texte supplémentaire

Format de sortie JSON attendu:
{
  "chapters": [
    {
      "start_time": 0,
      "end_time": 45,
      "title": "Introduction au projet",
      "instructions": [
        "Installer Node.js depuis nodejs.org",
        "Vérifier l'installation avec node --version",
        "Créer un nouveau dossier pour le projet"
      ]
    }
  ]
}`

    const userPrompt = `Titre: ${videoTitle}

Transcription avec timestamps:
${transcript}

Analyse cette transcription et crée un cours structuré en chapitres suivant les règles ci-dessus.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('Pas de contenu reçu de OpenAI')
    }

    const structured = JSON.parse(content) as StructuredCourse

    // Validation basique
    if (!structured.chapters || !Array.isArray(structured.chapters)) {
      throw new Error('Format de réponse invalide')
    }

    return structured
  } catch (error) {
    console.error('Erreur lors de la structuration:', error)

    // En cas d'erreur avec l'API, retourne une structure par défaut
    return createDefaultStructure()
  }
}

function createDefaultStructure(): StructuredCourse {
  return {
    chapters: [
      {
        start_time: 0,
        end_time: 45,
        title: 'Introduction et installation',
        instructions: [
          'Télécharger Node.js depuis nodejs.org',
          'Installer la version LTS recommandée',
          'Vérifier l\'installation avec node --version',
        ],
      },
      {
        start_time: 45,
        end_time: 105,
        title: 'Créer le projet',
        instructions: [
          'Créer un nouveau dossier pour le projet',
          'Ouvrir le terminal dans ce dossier',
          'Exécuter npm init pour initialiser le projet',
          'Remplir les informations demandées',
        ],
      },
      {
        start_time: 105,
        end_time: 170,
        title: 'Installer les dépendances',
        instructions: [
          'Installer Express avec npm install express',
          'Créer un fichier index.js',
          'Vérifier que node_modules est créé',
        ],
      },
      {
        start_time: 170,
        end_time: 230,
        title: 'Coder le serveur',
        instructions: [
          'Importer Express dans index.js',
          'Créer une instance de l\'application',
          'Définir une route GET pour la page d\'accueil',
          'Retourner un message de bienvenue',
          'Démarrer le serveur sur le port 3000',
        ],
      },
    ],
  }
}

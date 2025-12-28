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
    const { youtubeUrl } = await request.json()

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'URL YouTube requise' },
        { status: 400 }
      )
    }

    const videoId = extractVideoId(youtubeUrl)
    if (!videoId) {
      return NextResponse.json(
        { error: 'URL YouTube invalide' },
        { status: 400 }
      )
    }

    // ÉTAPE 1: Extraction du titre de la vidéo (via YouTube Data API ou simulation)
    // Pour cette démo, nous utilisons un titre générique
    const videoTitle = `Tutoriel YouTube - ${videoId}`

    // ÉTAPE 2: Extraction audio et transcription avec Whisper
    // NOTE: Cette section nécessite un service tiers pour extraire l'audio
    // Pour l'instant, nous utilisons une transcription simulée pour la démo
    const rawTranscript = await getTranscript(videoId)

    // ÉTAPE 3: Structuration pédagogique avec GPT-4o
    const structuredChapters = await structureContent(rawTranscript, videoTitle)

    // ÉTAPE 4: Sauvegarde dans la base de données
    const course = await prisma.course.create({
      data: {
        youtube_url: youtubeUrl,
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
      { error: 'Erreur lors de la génération du cours' },
      { status: 500 }
    )
  }
}

async function getTranscript(videoId: string): Promise<string> {
  // TODO: Implémenter l'extraction audio via un service tiers (ex: youtube-dl, yt-dlp)
  // puis la transcription via OpenAI Whisper

  // Pour la démo, retourne une transcription simulée
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

Ton rôle est d'analyser une transcription de tutoriel vidéo et de la découper en chapitres d'apprentissage logiques.

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

    const userPrompt = `Titre de la vidéo: ${videoTitle}

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

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { StructuredCourse } from '@/types/course'
import { prisma } from '@/lib/prisma'

// Configuration pour Next.js App Router
export const maxDuration = 300 // 5 minutes
export const dynamic = 'force-dynamic'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type doit être multipart/form-data' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier la taille du fichier (max 25MB pour Whisper)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `Fichier trop volumineux`,
          details: `Taille: ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum: 25 MB (limite Whisper).`
        },
        { status: 400 }
      )
    }

    console.log('📄 Fichier reçu:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)} MB)`)
    console.log('🎤 Début de la transcription...')

    // Transcrire directement avec Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'],
    })

    console.log('✅ Transcription terminée')

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
      formattedTranscript = `[00:00] ${transcription.text}`
    }

    console.log('🤖 Structuration avec GPT-4o...')

    // Structurer avec GPT-4o
    const videoTitle = file.name.replace(/\.[^/.]+$/, '')
    const structuredChapters = await structureContent(formattedTranscript, videoTitle)

    console.log('💾 Sauvegarde dans la base de données...')

    // Sauvegarder dans la base de données
    const course = await prisma.course.create({
      data: {
        youtube_url: `uploaded://${file.name}`,
        video_title: videoTitle,
        raw_transcript: formattedTranscript,
        structured_chapters: JSON.stringify(structuredChapters),
      },
    })

    console.log('🎉 Cours créé avec succès:', course.id)

    return NextResponse.json({
      courseId: course.id,
      message: 'Cours généré avec succès',
    })
  } catch (error) {
    console.error('❌ Erreur:', error)

    // Gestion spécifique des erreurs OpenAI
    if (error && typeof error === 'object' && 'error' in error) {
      const openaiError = error as any
      return NextResponse.json(
        {
          error: 'Erreur OpenAI',
          details: openaiError.error?.message || openaiError.message || 'Erreur inconnue'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Erreur lors du traitement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

async function structureContent(
  transcript: string,
  videoTitle: string
): Promise<StructuredCourse> {
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

  if (!structured.chapters || !Array.isArray(structured.chapters)) {
    throw new Error('Format de réponse invalide')
  }

  return structured
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ChapterAccordion from '@/components/ChapterAccordion'
import type { Course } from '@/types/course'
import type { StructuredCourse } from '@/types/course'

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course/${params.id}`)

        if (!response.ok) {
          throw new Error('Cours non trouvé')
        }

        const data = await response.json()
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du cours...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p className="mb-4">{error || 'Cours non trouvé'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  const structuredCourse: StructuredCourse = JSON.parse(course.structured_chapters)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </button>

          <h1 className="text-3xl font-bold mb-2">{course.video_title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {structuredCourse.chapters.length} chapitres
          </p>
        </div>

        {/* Liste des chapitres */}
        <div className="space-y-4">
          {structuredCourse.chapters.map((chapter, index) => (
            <ChapterAccordion
              key={index}
              chapter={chapter}
              chapterIndex={index}
              youtubeUrl={course.youtube_url}
            />
          ))}
        </div>

        {/* Pied de page */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Félicitations !</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez chaque chapitre et cochez les instructions au fur et à mesure pour suivre votre progression.
            La vidéo de chaque chapitre commence et se termine automatiquement au bon moment.
          </p>
        </div>
      </div>
    </div>
  )
}

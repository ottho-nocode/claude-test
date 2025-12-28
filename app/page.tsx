'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type InputMode = 'url' | 'upload'

export default function Home() {
  const [mode, setMode] = useState<InputMode>('upload')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setProgress('')

    if (mode === 'url' && !youtubeUrl) {
      setError('Veuillez entrer une URL YouTube valide')
      return
    }

    if (mode === 'upload' && !audioFile) {
      setError('Veuillez sélectionner un fichier audio ou vidéo')
      return
    }

    setLoading(true)

    try {
      if (mode === 'upload') {
        await handleFileUpload()
      } else {
        await handleYoutubeUrl()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!audioFile) return

    setProgress('Upload et transcription en cours...')

    const formData = new FormData()
    formData.append('file', audioFile)

    const response = await fetch('/api/upload-audio', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.details || 'Erreur lors du traitement')
    }

    router.push(`/course/${data.courseId}`)
  }

  const handleYoutubeUrl = async () => {
    setProgress('Analyse de la vidéo YouTube...')

    const response = await fetch('/api/generate-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeUrl }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue')
    }

    router.push(`/course/${data.courseId}`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/mp4', 'video/mp4', 'video/webm']
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|mp4|webm)$/i)) {
        setError('Format de fichier non supporté. Utilisez MP3, WAV, M4A, MP4 ou WebM')
        return
      }
      setAudioFile(file)
      setError('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            YouTube Learning Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Transformez vos tutoriels en guides d'apprentissage interactifs étape par étape
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            📁 Upload Audio/Vidéo
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🔗 URL YouTube
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'upload' ? (
            <div>
              <label htmlFor="audio-file" className="block text-sm font-medium mb-2">
                Fichier Audio ou Vidéo
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  id="audio-file"
                  type="file"
                  accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.webm"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="audio-file"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {audioFile ? (
                    <>
                      <div className="text-green-600 dark:text-green-400 mb-2">✓ Fichier sélectionné</div>
                      <div className="font-medium">{audioFile.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-lg font-medium mb-1">Cliquez pour uploader</div>
                      <div className="text-sm text-gray-500">MP3, WAV, M4A, MP4, WebM (max 25MB)</div>
                    </>
                  )}
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💡 Astuce : Uploadez l'audio d'un tutoriel pour générer un guide d'apprentissage
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium mb-2">
                URL YouTube
              </label>
              <input
                id="youtube-url"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Exemple : https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {progress && (
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-lg">
              {progress}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération du cours en cours...
              </span>
            ) : (
              'Générer le cours'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

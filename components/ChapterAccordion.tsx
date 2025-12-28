'use client'

import { useState } from 'react'
import { Chapter } from '@/types/course'
import { extractVideoId, getYouTubeEmbedUrl } from '@/lib/youtube'

interface ChapterAccordionProps {
  chapter: Chapter
  chapterIndex: number
  youtubeUrl: string
}

export default function ChapterAccordion({
  chapter,
  chapterIndex,
  youtubeUrl,
}: ChapterAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})

  const videoId = extractVideoId(youtubeUrl)
  const embedUrl = videoId
    ? getYouTubeEmbedUrl(videoId, chapter.start_time, chapter.end_time)
    : ''

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const progress =
    (Object.values(checkedItems).filter(Boolean).length /
      chapter.instructions.length) *
    100

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold text-sm">
            {chapterIndex + 1}
          </span>
          <div className="text-left flex-1">
            <h3 className="font-semibold text-lg">{chapter.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(chapter.start_time)} - {formatTime(chapter.end_time)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {progress > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(progress)}%
              </span>
            </div>
          )}

          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="p-6 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lecteur vidéo à gauche */}
            <div>
              <h4 className="font-semibold mb-3">Vidéo</h4>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Vidéo non disponible
                  </div>
                )}
              </div>
            </div>

            {/* Checklist à droite */}
            <div>
              <h4 className="font-semibold mb-3">Instructions</h4>
              <div className="space-y-3">
                {chapter.instructions.map((instruction, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[idx] || false}
                      onChange={() => toggleCheck(idx)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={checkedItems[idx] ? 'line-through text-gray-400' : ''}>
                      {instruction}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export interface Chapter {
  start_time: number
  end_time: number
  title: string
  instructions: string[]
}

export interface StructuredCourse {
  chapters: Chapter[]
}

export interface Course {
  id: string
  youtube_url: string
  video_title: string
  raw_transcript: string
  structured_chapters: string // JSON string
  created_at: Date
  updated_at: Date
}

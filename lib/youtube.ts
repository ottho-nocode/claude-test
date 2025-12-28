export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function getYouTubeEmbedUrl(videoId: string, startTime?: number, endTime?: number): string {
  let url = `https://www.youtube.com/embed/${videoId}?`
  const params = []

  if (startTime !== undefined) {
    params.push(`start=${Math.floor(startTime)}`)
  }

  if (endTime !== undefined) {
    params.push(`end=${Math.floor(endTime)}`)
  }

  return url + params.join('&')
}

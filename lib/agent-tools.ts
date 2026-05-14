import { prisma } from '@/lib/prisma'

export const prismaToolDefinitions = [
  {
    type: 'custom' as const,
    name: 'list_courses',
    description:
      'List courses stored in the database. Returns id, video_title, youtube_url, and created_at for each. Use limit to bound the result (default 20).',
    input_schema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      },
      required: [],
    },
  },
  {
    type: 'custom' as const,
    name: 'get_course',
    description:
      'Fetch the full details of a single course by id, including raw_transcript and structured_chapters (JSON string).',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The course UUID' },
      },
      required: ['id'],
    },
  },
  {
    type: 'custom' as const,
    name: 'search_courses',
    description:
      'Search courses whose video_title contains the given substring (case-insensitive).',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Substring to match in video_title' },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      },
      required: ['query'],
    },
  },
  {
    type: 'custom' as const,
    name: 'create_course',
    description:
      'Create a new course row. structured_chapters must be a JSON-encoded string.',
    input_schema: {
      type: 'object',
      properties: {
        youtube_url: { type: 'string' },
        video_title: { type: 'string' },
        raw_transcript: { type: 'string' },
        structured_chapters: {
          type: 'string',
          description: 'JSON-encoded chapter structure',
        },
      },
      required: ['youtube_url', 'video_title', 'raw_transcript', 'structured_chapters'],
    },
  },
  {
    type: 'custom' as const,
    name: 'update_course',
    description: 'Update fields on an existing course. Only provided fields are changed.',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        video_title: { type: 'string' },
        youtube_url: { type: 'string' },
        raw_transcript: { type: 'string' },
        structured_chapters: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    type: 'custom' as const,
    name: 'delete_course',
    description: 'Delete a course by id.',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
]

type ToolResult = { ok: true; data: unknown } | { ok: false; error: string }

export async function runPrismaTool(name: string, input: unknown): Promise<ToolResult> {
  const args = (input ?? {}) as Record<string, unknown>
  try {
    switch (name) {
      case 'list_courses': {
        const limit = Math.min(Math.max(Number(args.limit ?? 20), 1), 100)
        const rows = await prisma.course.findMany({
          take: limit,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            video_title: true,
            youtube_url: true,
            created_at: true,
          },
        })
        return { ok: true, data: rows }
      }
      case 'get_course': {
        const id = String(args.id)
        const row = await prisma.course.findUnique({ where: { id } })
        if (!row) return { ok: false, error: `Course ${id} not found` }
        return { ok: true, data: row }
      }
      case 'search_courses': {
        const query = String(args.query ?? '')
        const limit = Math.min(Math.max(Number(args.limit ?? 20), 1), 100)
        const rows = await prisma.course.findMany({
          where: { video_title: { contains: query, mode: 'insensitive' } },
          take: limit,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            video_title: true,
            youtube_url: true,
            created_at: true,
          },
        })
        return { ok: true, data: rows }
      }
      case 'create_course': {
        const created = await prisma.course.create({
          data: {
            youtube_url: String(args.youtube_url),
            video_title: String(args.video_title),
            raw_transcript: String(args.raw_transcript),
            structured_chapters: String(args.structured_chapters),
          },
        })
        return { ok: true, data: { id: created.id } }
      }
      case 'update_course': {
        const id = String(args.id)
        const data: Record<string, string> = {}
        for (const key of [
          'video_title',
          'youtube_url',
          'raw_transcript',
          'structured_chapters',
        ] as const) {
          if (typeof args[key] === 'string') data[key] = args[key] as string
        }
        const updated = await prisma.course.update({ where: { id }, data })
        return { ok: true, data: { id: updated.id } }
      }
      case 'delete_course': {
        const id = String(args.id)
        await prisma.course.delete({ where: { id } })
        return { ok: true, data: { id, deleted: true } }
      }
      default:
        return { ok: false, error: `Unknown tool: ${name}` }
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

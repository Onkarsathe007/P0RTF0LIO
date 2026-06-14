import { readFile } from 'fs/promises'
import path from 'path'

const WRITEUPS_DIR = path.join(process.cwd(), 'writeups')

function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()

  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.svg') return 'image/svg+xml'

  return 'application/octet-stream'
}

export async function GET(
  _request: Request,
  context: { params: { path: string[] } }
) {
  try {
    const { path: filePathParts } = context.params
    const requestedPath = filePathParts.join('/')
    const fullPath = path.join(WRITEUPS_DIR, requestedPath)
    const normalized = path.normalize(fullPath)

    if (!normalized.startsWith(path.normalize(WRITEUPS_DIR + path.sep))) {
      return new Response('Invalid path', { status: 400 })
    }

    const data = await readFile(normalized)

    return new Response(data, {
      headers: {
        'Content-Type': getContentType(normalized),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}

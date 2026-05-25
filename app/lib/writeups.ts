import { readFile, readdir } from 'fs/promises'
import path from 'path'

export type WriteupMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
}

export type Writeup = WriteupMeta & {
  content: string
}

const WRITEUPS_DIR = path.join(process.cwd(), 'writeups')

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    throw new Error('Writeup is missing frontmatter.')
  }

  const [, rawFrontmatter, content] = match
  const entries = rawFrontmatter
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(':')
      if (separatorIndex === -1) {
        return null
      }

      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()
      return [key, value] as const
    })
    .filter((entry): entry is readonly [string, string] => entry !== null)

  const frontmatter = Object.fromEntries(entries)

  return {
    frontmatter,
    content: content.trim(),
  }
}

function formatDisplayDate(value: string) {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export async function getWriteups() {
  const files = await readdir(WRITEUPS_DIR)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  const writeups = await Promise.all(
    markdownFiles.map(async (file) => {
      const slug = file.replace(/\.md$/, '')
      const source = await readFile(path.join(WRITEUPS_DIR, file), 'utf8')
      const { frontmatter } = parseFrontmatter(source)

      return {
        slug,
        title: frontmatter.title ?? slug,
        date: formatDisplayDate(frontmatter.date ?? ''),
        excerpt: frontmatter.excerpt ?? '',
        sortDate: frontmatter.date ?? '',
      }
    })
  )

  return writeups
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .map(({ sortDate, ...writeup }) => writeup)
}

export async function getWriteupBySlug(slug: string): Promise<Writeup | null> {
  try {
    const source = await readFile(path.join(WRITEUPS_DIR, `${slug}.md`), 'utf8')
    const { frontmatter, content } = parseFrontmatter(source)

    return {
      slug,
      title: frontmatter.title ?? slug,
      date: formatDisplayDate(frontmatter.date ?? ''),
      excerpt: frontmatter.excerpt ?? '',
      content,
    }
  } catch {
    return null
  }
}

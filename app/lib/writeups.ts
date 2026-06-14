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
const HASHNODE_ENDPOINT = 'https://gql.hashnode.com/'
const DEFAULT_HASHNODE_PUBLICATION_HOST = 'blog.onkarsathe.co.in'

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
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

async function getLocalWriteups() {
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

async function getLocalWriteupBySlug(slug: string): Promise<Writeup | null> {
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

type HashnodePostNode = {
  title: string
  brief: string
  slug: string
  publishedAt: string
  content?: {
    markdown?: string
  } | null
}

async function fetchHashnode<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  try {
    const response = await fetch(HASHNODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 900 },
    })

    if (!response.ok) {
      return null
    }

    const payload = await response.json()

    if (payload.errors?.length) {
      return null
    }

    return payload.data as T
  } catch {
    return null
  }
}

type HashnodePostsPage = {
  publication?: {
    posts?: {
      edges?: Array<{ node: HashnodePostNode }>
      pageInfo?: {
        hasNextPage?: boolean
        endCursor?: string | null
      }
    }
  }
}

async function getHashnodeWriteups(publicationHost: string): Promise<WriteupMeta[] | null> {
  const query = `
    query PublicationPosts($host: String!, $first: Int!, $after: String) {
      publication(host: $host) {
        posts(first: $first, after: $after) {
          edges {
            node {
              title
              brief
              slug
              publishedAt
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `

  const posts: HashnodePostNode[] = []
  let after: string | null = null
  let hasNextPage = true

  while (hasNextPage) {
    const data: HashnodePostsPage | null = await fetchHashnode<HashnodePostsPage>(query, {
      host: publicationHost,
      first: 100,
      after,
    })

    const pagePosts = data?.publication?.posts?.edges?.map((edge: { node: HashnodePostNode }) => edge.node) ?? []
    posts.push(...pagePosts)

    const pageInfo: {
      hasNextPage?: boolean
      endCursor?: string | null
    } | undefined = data?.publication?.posts?.pageInfo
    hasNextPage = Boolean(pageInfo?.hasNextPage)
    after = pageInfo?.endCursor ?? null

    if (!pagePosts.length) {
      break
    }
  }

  if (!posts.length) {
    return null
  }

  return posts
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: formatDisplayDate(post.publishedAt),
      excerpt: post.brief ?? '',
      sortDate: post.publishedAt,
    }))
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .map(({ sortDate, ...writeup }) => writeup)
}

async function getHashnodeWriteupBySlug(publicationHost: string, slug: string): Promise<Writeup | null> {
  const query = `
    query PublicationPostBySlug($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          title
          brief
          slug
          publishedAt
          content {
            markdown
          }
        }
      }
    }
  `

  const data = await fetchHashnode<{
    publication?: {
      post?: HashnodePostNode | null
    }
  }>(query, { host: publicationHost, slug })

  const post = data?.publication?.post

  if (!post) {
    return null
  }

  return {
    slug: post.slug,
    title: post.title,
    date: formatDisplayDate(post.publishedAt),
    excerpt: post.brief ?? '',
    content: post.content?.markdown?.trim() || post.brief || '',
  }
}

function getPublicationHost() {
  return process.env.HASHNODE_PUBLICATION_HOST ?? DEFAULT_HASHNODE_PUBLICATION_HOST
}

export async function getWriteups() {
  const hashnodeWriteups = await getHashnodeWriteups(getPublicationHost())
  if (hashnodeWriteups) {
    return hashnodeWriteups
  }

  return getLocalWriteups()
}

export async function getWriteupBySlug(slug: string): Promise<Writeup | null> {
  const hashnodeWriteup = await getHashnodeWriteupBySlug(getPublicationHost(), slug)
  if (hashnodeWriteup) {
    return hashnodeWriteup
  }

  return getLocalWriteupBySlug(slug)
}

import { Fragment } from 'react'
import { MermaidDiagram } from './mermaid-diagram'

function renderInline(text: string) {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean)

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index}>{token.slice(2, -2)}</strong>
    }

    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={index}>{token.slice(1, -1)}</em>
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={index}>{token.slice(1, -1)}</code>
    }

    return <Fragment key={index}>{token}</Fragment>
  })
}

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'code'; language: string; content: string }

function decodeURIComponentSafe(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function toAssetSrc(rawPath: string) {
  const cleaned = rawPath.trim().replace(/^\.\//, '')
  const normalizedPath = cleaned.includes('/') ? cleaned : `img/${cleaned}`

  const encodedPath = normalizedPath
    .split('/')
    .map((segment) => encodeURIComponent(decodeURIComponentSafe(segment)))
    .join('/')

  return `/writeups-assets/${encodedPath}`
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split('\n')
  const blocks: Block[] = []

  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      index += 1
      continue
    }

    if (trimmedLine.startsWith('```')) {
      const language = trimmedLine.slice(3).trim()
      const content: string[] = []
      index += 1

      while (index < lines.length && !lines[index].startsWith('```')) {
        content.push(lines[index])
        index += 1
      }

      blocks.push({
        type: 'code',
        language,
        content: content.join('\n').trim(),
      })

      index += 1
      continue
    }

    const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.*)$/)
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      })
      index += 1
      continue
    }

    const obsidianImageMatch = trimmedLine.match(/^!\[\[(.+?)\]\]$/)
    if (obsidianImageMatch) {
      const [rawPath, rawAlt] = obsidianImageMatch[1].split('|')
      blocks.push({
        type: 'image',
        src: toAssetSrc(rawPath),
        alt: (rawAlt ?? rawPath).trim(),
      })
      index += 1
      continue
    }

    const markdownImageMatch = trimmedLine.match(/^!\[(.*?)\]\((.+?)\)$/)
    if (markdownImageMatch) {
      const [, altText, rawPath] = markdownImageMatch
      blocks.push({
        type: 'image',
        src: toAssetSrc(rawPath),
        alt: altText || rawPath,
      })
      index += 1
      continue
    }

    if (trimmedLine.startsWith('- ')) {
      const items: string[] = []

      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(lines[index].trim().slice(2).trim())
        index += 1
      }

      blocks.push({ type: 'unordered-list', items })
      continue
    }

    if (/^\d+\.\s/.test(trimmedLine)) {
      const items: string[] = []

      while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s/, '').trim())
        index += 1
      }

      blocks.push({ type: 'ordered-list', items })
      continue
    }

    const paragraph: string[] = []

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith('```') &&
      !lines[index].trim().startsWith('- ') &&
      !/^\d+\.\s/.test(lines[index].trim()) &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !/^!\[\[(.+?)\]\]$/.test(lines[index].trim()) &&
      !/^!\[(.*?)\]\((.+?)\)$/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }

    blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
  }

  return blocks
}

export function MarkdownRenderer({
  content,
  omitFirstH1 = false,
}: {
  content: string
  omitFirstH1?: boolean
}) {
  const blocks = parseBlocks(content)

  return (
    <div className="markdown-flow">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          if (omitFirstH1 && block.level === 1 && index === 0) {
            return null
          }

          if (block.level === 1) {
            return (
              <h1 key={index} className="markdown-h1">
                {renderInline(block.text)}
              </h1>
            )
          }

          if (block.level === 2) {
            return (
              <h2 key={index} className="markdown-h2">
                {renderInline(block.text)}
              </h2>
            )
          }

          return (
            <h3 key={index} className="markdown-h3">
              {renderInline(block.text)}
            </h3>
          )
        }

        if (block.type === 'paragraph') {
          return (
            <p key={index} className="markdown-paragraph">
              {renderInline(block.text)}
            </p>
          )
        }

        if (block.type === 'image') {
          return <img key={index} className="markdown-image" src={block.src} alt={block.alt} loading="lazy" />
        }

        if (block.type === 'unordered-list') {
          return (
            <ul key={index} className="markdown-list">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }

        if (block.type === 'ordered-list') {
          return (
            <ol key={index} className="markdown-ordered-list">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ol>
          )
        }

        if (block.language === 'mermaid') {
          return <MermaidDiagram key={index} chart={block.content} />
        }

        return (
          <pre key={index} className="markdown-code-block">
            <code>{block.content}</code>
          </pre>
        )
      })}
    </div>
  )
}

'use client'

import { useEffect, useId, useState } from 'react'

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void
      render: (id: string, code: string) => Promise<{ svg: string }>
    }
  }
}

let mermaidLoader: Promise<void> | null = null

function loadMermaid() {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.mermaid) {
    return Promise.resolve()
  }

  if (!mermaidLoader) {
    mermaidLoader = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-mermaid-loader="true"]')

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Mermaid.')), { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
      script.async = true
      script.dataset.mermaidLoader = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Mermaid.'))
      document.head.appendChild(script)
    })
  }

  return mermaidLoader
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const id = useId().replace(/:/g, '-')

  useEffect(() => {
    let cancelled = false

    async function renderDiagram() {
      try {
        await loadMermaid()

        if (!window.mermaid) {
          throw new Error('Mermaid is unavailable.')
        }

        const isDark = document.documentElement.dataset.theme === 'dark'

        window.mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            background: 'transparent',
            primaryColor: isDark ? '#18181b' : '#f4f4f5',
            primaryTextColor: isDark ? '#f4f4f5' : '#09090b',
            primaryBorderColor: isDark ? '#3f3f46' : '#27272a',
            lineColor: isDark ? '#a1a1aa' : '#52525b',
            secondaryColor: isDark ? '#09090b' : '#fafafa',
            tertiaryColor: isDark ? '#18181b' : '#ffffff',
            fontFamily: 'Victor Mono, monospace',
          },
        })

        const rendered = await window.mermaid.render(`mermaid-${id}`, chart)

        if (!cancelled) {
          setSvg(rendered.svg)
          setFailed(false)
        }
      } catch {
        if (!cancelled) {
          setFailed(true)
        }
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [chart, id])

  if (failed) {
    return (
      <pre className="markdown-code-block">
        <code>{chart}</code>
      </pre>
    )
  }

  if (!svg) {
    return (
      <div className="mermaid-shell">
        <div className="mermaid-loading">rendering diagram...</div>
      </div>
    )
  }

  return (
    <div
      className="mermaid-shell"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

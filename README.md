# Onkar Sathe Portfolio

Personal portfolio built with Next.js App Router and TypeScript.

## Sections
- **Start** (`/`) – intro, highlights, skills, featured projects
- **Projects** (`/agents`) – project showcase
- **Blogs** (`/writeups`) – markdown-based blog posts
- **Notes** (`/shitposts`) – short-form personal notes

## Blog Writing Workflow (Obsidian + GitHub)
- Open `writeups/` as your Obsidian vault.
- Write blog posts in `writeups/*.md`.
- Commit + push to GitHub; your blogs go live from these markdown files.

### Frontmatter format (required)

```md
---
title: Post title
date: YYYY-MM-DD
excerpt: Short summary
---
```

### Images (Excalidraw / screenshots)
- Use `.png` images (great for Excalidraw exports/screenshots).
- Store all blog images in: `writeups/img/`.
- In markdown, reference images like:

```md
![Architecture](img/architecture-v1.png)
```

> Obsidian attachment default is configured to `img/` via `writeups/.obsidian/app.json`, so pasted images go there automatically.

## Scripts
- `npm run dev` – run local dev server
- `npm run build` – production build
- `npm run start` – start production server

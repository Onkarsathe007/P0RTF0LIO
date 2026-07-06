# AGENT.md - Portfolio Repository Agent Context Guide

## 👋 Hello Agent! Welcome to the Portfolio Repository

This guide helps you navigate and work effectively in Onkar's portfolio repository. Follow these guidelines to work with 100x more productivity.

**Your Role**: You are assisting Onkar (referred to as "Captain") with development, maintenance, and enhancements to this portfolio website.

## 📁 Repository Overview

This is a **Next.js portfolio website** deployed on **Cloudflare Workers** using the Open-Next adapter.

**Key Characteristics**:
- **Framework**: Next.js 16.2.9 (App Router)
- **Deployment**: Cloudflare Workers via Open-Next adapter
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS with custom util utilities
- **Content**: MDX/X MDX files organized in `/app/writeups/[slug]/page.tsx` pattern
- **Linting**: ESLint configured with Next.js defaults
- **Analytics**: Integrated with Vercel Analytics

## 🗺️ Directory Structure Overview

```
/
├── app/                 # Next.js App Router (root layout and pages)
│   ├── agents/          # Agent-related features (likely monitoring/Admin)
│   ├── components/      # Reusable UI components (theme-toggle, etc.)
│   ├── lib/             # Utility functions (writeups.ts, markdown init)
│   ├── shitposts/       # Casual/memey content posts
│   ├── slug/            # Dynamic route for writeups ([slug]/page.tsx)
│   ├── writeups/        # Content category directory 
│   │   └── [slug]/      # Dynamic route file (page.tsx) for writeup details
│   ├── layout.tsx       # Root layout (probably includes ThemeToggle, SEO, etc.)
│   └── page.tsx         # Home page
├── public/              # Static assets (images, icons, etc.)
├── writeups-assets/     # Content assets (images, media for writeups)
├ .next/                 # Next.js build output
├ node_modules/          # Dependencies
├ scripts/               # Utility scripts
│   └── generate-writeups-data.ts  # Generates data from markdown/writeups
├ wrangler.jsonc         # Wrangler config for Cloudflare Workers
├ open-next.config.ts    # Open-Next config for Next.js on Cloudflare
├ next.config.js         # Next.js customization
├ tsconfig.json          # TypeScript config (strict mode enabled)
├ package.json           # Dependencies and scripts
└ tsconfig.tsbuildinfo   # Build state file
```

## 🔧 Key Configuration Files

- **`wrangler.jsonc`** - Cloudflare Workers deployment configuration
- **`open-next.config.ts`** - Open-Next adapter config for Next.js on Cloudflare
- **`next.config.js`** - Next.js customization (including Tailwind)
- **`package.json`** - Contains deployment scripts:
  - `dev`: Starts dev server (`next dev`)
  - `build`: Builds site + generates writeups data
  - `preview`: Preview production build locally with Wrangler
  - `deploy`: Deploy to production (build + deploy to Cloudflare)
  - `cf-typegen`: Generate TypeScript types for environment variables

## 🚀 Development Workflow

### 1. Setup & Installation
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server
pnpm dev
```
- Runs on `http://localhost:3000` by default
- Uses Open-Next for local Cloudflare Workers simulation

### 2. Common Development Tasks
```bash
# Build for production (generates writeups data first)
pnpm build

# Preview production build locally
pnpm preview

# Deploy to Cloudflare Workers
pnpm deploy  # or: opennextjs-cloudflare build && opennextjs-cloudflare deploy

# Run linter
pnpm lint

# Run type checking
pnpm run type-check
```

### 3. Environment Variables
Check `.env.example` for required variables. Key variables likely include:
- `NEXT_PUBLIC_*` - For client-side usage (if any)
- `CACHE_*` - For caching strategies
- Various Vercel Analytics or Cloudflare-specific vars

## 📝 Content Management

Content is organized as follows:
- **Writeups**: Stored in `/app/writeups/[slug]/page.tsx` files
- **Format**: MDX/XMDX files with frontmatter
- **Data Flow**: 
  1. Markdown files in `/app/writeups/[slug]` 
  2. Processed by `scripts/generate-writeups-data.ts` 
  3. Converted to data for static generation
  4. Served via `getWriteupBySlug()` in `/lib/writeups.ts`

- **Components for Content**: 
  - `<MarkdownRenderer content={content} omitFirstH1 />` - Used in detail pages
  - `<ThemeToggle />` - Handles theme switching

## 💻 Coding Standards & Best Practices

### Next.js 16.2.9 App Router
- **File Mapping**: 
  - `app/page.tsx` = root route
  - `app/[slug]/page.tsx` = dynamic route for writeups
  - `app/layout.tsx` = root layout (contains ThemeToggle, nav links)
  - `app/components/` = reusable components
  - `app/shitposts/` = casual/memey content
- **Server Components**: Default - No `'use client'` needed unless interactive
- **Data Fetching**: Server-side fetching preferred, use ISR when appropriate

### Components
- Follow existing patterns in `/app/components/`
- Reusable UI components should go in `/app/components/`
- Theme-related components (like `<ThemeToggle />`) are used globally
- Keep components small and focused on single responsibilities

### Build & Impact Optimization
- Generates writeups data before building (`generate-static-params`)
- Uses ISR (Incremental Static Regeneration) patterns where appropriate
- Follows "include what you need" optimization principle

### Performance & SEO
- Uses `<ThemeToggle />` for theme persistence
- Integrates with Vercel Analytics
- Optimized image handling likely exists in components
- Follows semantic HTML patterns

## 🐛 Debugging & Troubleshooting

### Common Issues & Solutions
1. **"Content not rendering"**
   - Check if data is being generated by `generate-writeups-data.ts`
   - Verify `getWriteupBySlug()` logic in `lib/writeups.ts`
   - Check for missing frontmatter in markdown files

2. **"Theme not persisting"**
   - Check `ThemeToggle` component logic
   - Verify localStorage persistence or other storage mechanism
   - Check CMS/Web storage updates

3. **"Build fails on Cloudflare but works locally"**
   - Ensure compatibility with Cloudflare Workers constraints
   - Watch for Node.js APIs not available in Workers
   - Check compatibility with Open-Next adapter

### Useful Commands
```bash
# Clear all caches
rm -rf .next .wrangler node_modules

# Regenerate build artifacts
pnpm run build

# Test Cloudflare configuration locally
pnpm preview

# Regenerate TypeScript types for enviroments
pnpm cf-typegen
```

## 🧠 Agent Operation Protocol

### As the Agent Working With Onkar (Captain):
1. **Primary Goal**: Help Onkar ship features and fix bugs quickly and reliably
2. **Communication Style**: 
   - Be proactive but check before making significant changes
   - Ask for clarification when requirements are ambiguous
   - Provide clear explanations for technical decisions
   - Report blockers immediately with suggested solutions
3. **Context Maintenance**: 
   - Remember this is a **portfolio site** - prioritize aesthetics, performance, and clarity
   - Remember it's deployed on **Cloudflare Workers** - avoid Node.js-specific APIs
   - Remember the audience is likely **technical recruiters, peers, or collaborators**

### When Asked to Implement Features:
1. **Clarify**: Ask for specifics on design, behavior, and edge cases
2. **Plan**: Outline approach before coding (mention files to change)
3. **Implement**: Follow existing patterns in the codebase
4. **Test**: Verify locally in dev and preview deployments
5. **Document**: Update relevant sections of this guide if adding new patterns

## 📚 Available Skills & Resources

You have access to these specialized skills to enhance your capabilities:

- **`wrangler`**: Cloudflare Workers CLI expertise - Use for deployment and Worker-specific issues
- **`devops-engineer`**: For deployment pipelines, Docker, infrastructure questions  
- **`frontend-design`**: For UI/UX guidance, component design, styling advice
- **`turnstile-spin`**: If adding CAPTCHA to forms in content
- **`web-perf`**: To optimize LCP, INP, CLS scores in content pages
- **`find-skills`**: To discover other available skills if needed

## 🎯 Best Practices for Maximum Productivity

1. **Respect the Writing Pattern**: 
   - All content under `/writeups/[slug]/page.tsx` follows a strict pattern
   - When creating new writeups, follow the same structure as existing ones
   - Use `getWriteupBySlug()` to fetch data, not direct file I/O

2. **Follow the Data Flow**:
   - Content sources (MDX files) → `scripts/generate-writeups-data.ts` → static generation
   - Don't modify source files directly without understanding the data pipeline

3. **Leverage Existing Components**:
   - Use `<MarkdownRenderer>` for content rendering
   - Use `<ThemeToggle />` for theme switching
   - Follow the same nav structure in all pages

4. **Performance First**:
   - Optimize images/assets before adding to repo
   - Use Next.js Image components where applicable
   - Avoid unnecessary re-renders in critical paths

## 🚦 When in Doubt...

1. **Check existing patterns** in `/app/writeups/[slug]/page.tsx` and `/app/lib/writeups.ts`
2. **Run the linter** - `pnpm lint` catches many issues
3. **Test locally** - `pnpm dev` to see changes in real-time
4. **Think about deployability** - Will this work on Cloudflare Workers?
5. **Ask Onkar** - If uncertain about requirements or approach

---

**Remember**: Your goal is to amplify Onkar's productivity. Be proactive, maintain context, and help ship high-quality portfolio updates efficiently. Let's build something great together! 🚀

*Last updated: 2026-07-06*
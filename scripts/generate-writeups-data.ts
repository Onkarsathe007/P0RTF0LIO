import fs from 'fs/promises';
import path from 'path';

async function main() {
  const WRITEUPS_DIR = path.join(process.cwd(), 'writeups');
  const files = await fs.readdir(WRITEUPS_DIR);
  const markdownFiles = files.filter(file => file.endsWith('.md'));

  function parseFrontmatter(source: string) {
    const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) throw new Error('Missing frontmatter');
    const [, rawFrontmatter, content] = match;
    const entries = rawFrontmatter.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
      const i = line.indexOf(':');
      return i === -1 ? null : [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }).filter(Boolean);
    const frontmatter = Object.fromEntries(entries as [string, string][]);
    return {frontmatter, content: content.trim()};
  }

  const posts = [];
  for (const file of markdownFiles) {
    const slug = file.replace(/\.md$/, '');
    const source = await fs.readFile(path.join(WRITEUPS_DIR, file), 'utf8');
    try {
      const {frontmatter, content} = parseFrontmatter(source);
      posts.push({
        slug,
        title: frontmatter.title || slug,
        date: frontmatter.date || '',
        excerpt: frontmatter.excerpt || '',
        content,
      });
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
    }
  }

  const outPath = path.join(process.cwd(), 'app/lib/writeups-data.ts');
  await fs.writeFile(
    outPath,
    `// GENERATED FILE — DO NOT EDIT\nexport const writeups = ${JSON.stringify(posts, null, 2)} as const;\n`,
    'utf8'
  );
  console.log(`Generated ${outPath} with ${posts.length} post(s)!`);

  // Images in writeups/img/ must be deployable static assets
  // (Cloudflare Workers can't use fs.readFile for arbitrary paths)
  const imgSrc = path.join(WRITEUPS_DIR, 'img');
  const publicDest = path.join(process.cwd(), 'public', 'writeups-assets', 'img');
  await fs.rm(publicDest, { recursive: true, force: true }).catch(() => {});
  const imgFiles = await fs.readdir(imgSrc).catch(() => [] as string[]);
  if (imgFiles.length > 0) {
    await fs.cp(imgSrc, publicDest, { recursive: true });
    console.log(`Copied ${imgFiles.filter(f => f !== '.gitkeep').length} image(s) to ${publicDest}`);
  }
}

main();

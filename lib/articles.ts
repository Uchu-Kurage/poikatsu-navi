import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const articlesDir = path.join(process.cwd(), "content", "articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string; // YYYY-MM-DD
  readingMinutes: number;
  emoji: string;
};

export type Article = ArticleMeta & {
  contentHtml: string;
};

function estimateReadingMinutes(content: string): number {
  // 日本語想定: 1分あたり約500文字
  const chars = content.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getArticleMeta(slug: string): ArticleMeta {
  const fullPath = path.join(articlesDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    category: data.category ?? "その他",
    tags: Array.isArray(data.tags) ? data.tags : [],
    date: data.date ? String(data.date).slice(0, 10) : "1970-01-01",
    readingMinutes: data.readingMinutes ?? estimateReadingMinutes(content),
    emoji: data.emoji ?? "📝",
  };
}

export function getAllArticleMeta(): ArticleMeta[] {
  return getAllSlugs()
    .map(getArticleMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticle(slug: string): Promise<Article> {
  const meta = getArticleMeta(slug);
  const fullPath = path.join(articlesDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(raw);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return { ...meta, contentHtml: processed.toString() };
}

export function getAllCategories(): string[] {
  const set = new Set(getAllArticleMeta().map((a) => a.category));
  return Array.from(set);
}

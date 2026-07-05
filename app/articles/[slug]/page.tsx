import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getArticle, getArticleMeta } from "@/lib/articles";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getAllSlugs().includes(slug)) return {};
  const meta = getArticleMeta(slug);
  return { title: meta.title, description: meta.description };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getAllSlugs().includes(slug)) notFound();
  const article = await getArticle(slug);

  return (
    <article className="article-detail">
      <div className="crumbs">
        <Link href="/">ホーム</Link> / <Link href="/articles">記事一覧</Link> / {article.category}
      </div>
      <div style={{ fontSize: 56, margin: "18px 0 6px" }}>{article.emoji}</div>
      <span className="article-cat">{article.category}</span>
      <h1 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 900, margin: "12px 0 10px" }}>
        {article.title}
      </h1>
      <div style={{ color: "var(--text-faint)", fontSize: 14, marginBottom: 8 }}>
        {article.date} · 約{article.readingMinutes}分で読めます
      </div>
      <div className="chips" style={{ marginBottom: 24 }}>
        {article.tags.map((t) => (
          <span className="chip" key={t}>#{t}</span>
        ))}
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />

      <div style={{ margin: "48px 0 0", padding: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>次に読むなら</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/ranking" className="btn btn-primary">ランキングを見る →</Link>
          <Link href="/articles" className="btn btn-ghost">他の記事を読む</Link>
        </div>
      </div>
    </article>
  );
}

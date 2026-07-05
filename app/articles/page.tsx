import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticleMeta, getAllCategories } from "@/lib/articles";

export const metadata: Metadata = {
  title: "記事一覧",
  description: "ポイ活の始め方・稼ぎ方・注意点などのお役立ち記事をカテゴリ別にまとめています。",
};

export default function ArticlesPage() {
  const articles = getAllArticleMeta();
  const categories = getAllCategories();

  return (
    <>
      <div className="container page-head">
        <div className="crumbs"><Link href="/">ホーム</Link> / 記事一覧</div>
        <h1>ポイ活お役立ち記事</h1>
        <p>始め方から効率的な稼ぎ方、安全に使うための注意点まで。知りたいテーマから読めます。</p>
      </div>

      <section className="section container" style={{ paddingTop: 28 }}>
        <div className="filter-row">
          <span className="filter-chip active">すべて</span>
          {categories.map((c) => (
            <span className="filter-chip" key={c}>{c}</span>
          ))}
        </div>

        <div className="article-grid">
          {articles.map((a) => (
            <Link href={`/articles/${a.slug}`} key={a.slug} className="article-card">
              <div className="article-thumb">{a.emoji}</div>
              <div className="article-body">
                <span className="article-cat">{a.category}</span>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <div className="article-foot">
                  <span>{a.date}</span>
                  <span>· 約{a.readingMinutes}分</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

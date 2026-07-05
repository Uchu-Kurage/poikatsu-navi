import Link from "next/link";
import { rankedSites, overallScore } from "@/data/sites";
import { getAllArticleMeta } from "@/lib/articles";
import { RankingCard } from "@/components/RankingCard";
import { Stars } from "@/components/Stars";

export default function HomePage() {
  const ranked = rankedSites();
  const top3 = ranked.slice(0, 3);
  const articles = getAllArticleMeta().slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <span className="hero-eyebrow">💰 いま始めるべきポイ活が3分でわかる</span>
          <h1>
            <span className="hl">ポイ活</span>で、毎日を<br />ちょっとお得に。
          </h1>
          <p className="lead">
            数あるポイントサイトを還元率・使いやすさ・交換のしやすさで徹底比較。
            初心者の始め方から効率的な稼ぎ方まで、あなたに合ったポイ活が見つかります。
          </p>
          <div className="hero-actions">
            <Link href="/ranking" className="btn btn-primary">ランキングを見る →</Link>
            <Link href="/articles" className="btn btn-ghost">記事を読む</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">{ranked.length}<span style={{ fontSize: 15 }}>サイト</span></div>
              <div className="label">比較掲載中</div>
            </div>
            <div className="hero-stat">
              <div className="num">{getAllArticleMeta().length}<span style={{ fontSize: 15 }}>記事</span></div>
              <div className="label">お役立ちガイド</div>
            </div>
            <div className="hero-stat">
              <div className="num">300<span style={{ fontSize: 15 }}>円〜</span></div>
              <div className="label">最短で交換可能</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ranking */}
      <section className="section container">
        <div className="section-head">
          <div>
            <h2>総合ランキング TOP3</h2>
            <p className="sub">還元率・ショッピング・アンケート・ゲームの総合評価で厳選</p>
          </div>
          <Link href="/ranking" className="link-more">すべての比較を見る →</Link>
        </div>
        <div className="ranking-grid">
          {top3.map((site, i) => (
            <RankingCard key={site.id} site={site} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Comparison teaser */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>ひと目でわかる比較表</h2>
            <p className="sub">カテゴリ別の強さと交換条件をまとめてチェック</p>
          </div>
          <Link href="/ranking" className="link-more">詳しく比較する →</Link>
        </div>
        <div className="table-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th>サイト</th>
                <th>総合</th>
                <th>クレカ</th>
                <th>買い物</th>
                <th>アンケート</th>
                <th>ゲーム</th>
                <th>最低交換</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((site) => (
                <tr key={site.id}>
                  <td>
                    <span className="site-cell">
                      <span className="dot" style={{ background: site.color }} />
                      {site.name}
                    </span>
                  </td>
                  <td><strong>{overallScore(site).toFixed(1)}</strong></td>
                  <td><Stars score={site.ratings.creditCard} /></td>
                  <td><Stars score={site.ratings.shopping} /></td>
                  <td><Stars score={site.ratings.survey} /></td>
                  <td><Stars score={site.ratings.game} /></td>
                  <td>{site.minWithdrawYen}円〜</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Latest articles */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>新着・人気記事</h2>
            <p className="sub">始め方から効率化のコツまで、ポイ活のすべて</p>
          </div>
          <Link href="/articles" className="link-more">記事一覧へ →</Link>
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

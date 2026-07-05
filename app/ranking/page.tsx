import Link from "next/link";
import type { Metadata } from "next";
import { rankedSites, overallScore } from "@/data/sites";
import { RankingCard } from "@/components/RankingCard";
import { Stars } from "@/components/Stars";

export const metadata: Metadata = {
  title: "ポイントサイト還元率ランキング・比較",
  description: "主要ポイントサイトを還元率・買い物・アンケート・ゲームの観点で比較したランキング一覧。",
};

export default function RankingPage() {
  const ranked = rankedSites();
  return (
    <>
      <div className="container page-head">
        <div className="crumbs"><Link href="/">ホーム</Link> / ランキング</div>
        <h1>ポイントサイト比較ランキング</h1>
        <p>還元率・使いやすさ・交換のしやすさを総合評価。あなたの使い方に合ったサイトを見つけましょう。</p>
      </div>

      <section className="section container" style={{ paddingTop: 32 }}>
        <div className="ranking-grid">
          {ranked.map((site, i) => (
            <RankingCard key={site.id} site={site} rank={i + 1} />
          ))}
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>詳細比較表</h2>
            <p className="sub">★はカテゴリ別の体感還元・案件量の目安（5段階）</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th>順位</th>
                <th>サイト</th>
                <th>総合</th>
                <th>クレカ発行</th>
                <th>ショッピング</th>
                <th>アンケート</th>
                <th>ゲーム</th>
                <th>レート</th>
                <th>最低交換</th>
                <th>友達紹介</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((site, i) => (
                <tr key={site.id}>
                  <td><strong>{i + 1}</strong></td>
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
                  <td>1pt={site.yenPerPoint}円</td>
                  <td>{site.minWithdrawYen}円〜</td>
                  <td style={{ whiteSpace: "normal", minWidth: 180 }}>{site.friendBonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "var(--text-faint)", fontSize: 13, marginTop: 14 }}>
          ※ 掲載内容はサンプルを含みます。実際の還元率・条件は各公式サイトでご確認ください。
        </p>
      </section>
    </>
  );
}

import { PointSite, overallScore } from "@/data/sites";
import { Stars } from "./Stars";

const rankClass = ["rank-1", "rank-2", "rank-3"];
const medal = ["🥇", "🥈", "🥉"];

export function RankingCard({ site, rank }: { site: PointSite; rank: number }) {
  const score = overallScore(site);
  const cls = rankClass[rank - 1] ?? "rank-n";
  const label = medal[rank - 1] ?? `${rank}位`;
  return (
    <article className="rank-card">
      <span className={`rank-badge ${cls}`}>{label} {rank <= 3 ? `${rank}位` : ""}</span>
      <div className="site-name" style={{ color: site.color }}>{site.name}</div>
      <div className="score-row">
        <span className="score">{score.toFixed(1)}</span>
        <Stars score={score} />
      </div>
      <div className="chips">
        {site.strengths.slice(0, 3).map((s) => (
          <span className="chip" key={s}>{s}</span>
        ))}
      </div>
      <div className="meta-line">
        <span>1pt = {site.yenPerPoint}円</span>
        <span>最低交換 {site.minWithdrawYen}円〜</span>
      </div>
      <a className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
         href={site.officialUrl} target="_blank" rel="noopener noreferrer">
        公式サイトを見る
      </a>
    </article>
  );
}

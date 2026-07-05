import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  campaigns,
  getCampaign,
  campaignStatus,
  categoryMeta,
  formatPeriod,
  formatPostedDate,
} from "@/data/campaigns";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = getCampaign(id);
  if (!c) return {};
  return {
    title: `${c.title}（${c.provider}）`,
    description: c.summary,
  };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCampaign(id);
  if (!c) notFound();

  const st = campaignStatus(c);
  const cat = categoryMeta[c.category];

  return (
    <article className="article-detail">
      <div className="crumbs">
        <Link href="/">ホーム</Link> / <Link href="/#timeline">タイムライン</Link> / {c.category}
      </div>

      <div className="cd-head">
        <div className="cc-top" style={{ marginTop: 18 }}>
          <span className="cc-provider" style={{ background: c.providerColor }}>{c.provider}</span>
          <span className={`cc-status st-${st.key}`}>{st.label}</span>
        </div>
        <div className="cd-reward" style={{ color: cat.color }}>{c.reward}</div>
        <h1 className="cd-title">{c.title}</h1>
        <div className="cc-tags" style={{ marginTop: 4 }}>
          <span className="cc-cat">{cat.emoji} {c.category}</span>
          {c.tags.map((t) => (
            <span className="cc-tag" key={t}>#{t}</span>
          ))}
        </div>
      </div>

      <div className="cd-facts">
        <div className="cd-fact">
          <span className="cd-fact-label">開催期間</span>
          <span className="cd-fact-value">{formatPeriod(c)}</span>
        </div>
        <div className="cd-fact">
          <span className="cd-fact-label">状況</span>
          <span className="cd-fact-value">
            {st.label}
            {st.daysLeft !== null && st.key !== "soon" ? `（残り${st.daysLeft}日）` : ""}
          </span>
        </div>
        <div className="cd-fact">
          <span className="cd-fact-label">掲載日</span>
          <span className="cd-fact-value">{formatPostedDate(c.postedAt)}</span>
        </div>
      </div>

      <div className="prose" style={{ marginTop: 28 }}>
        <p style={{ fontSize: 16.5 }}>{c.summary}</p>
        <h2>参加条件・注意点</h2>
        <ul>
          {c.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      <div style={{ margin: "36px 0 0", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          className="btn btn-primary"
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          公式ページで詳細を見る →
        </a>
        <Link href="/#timeline" className="btn btn-ghost">タイムラインに戻る</Link>
      </div>

      <p style={{ color: "var(--text-faint)", fontSize: 13, marginTop: 24 }}>
        ※ 還元率・期間・条件にはサンプルを含みます。参加前に必ず公式ページの最新情報をご確認ください。
      </p>
    </article>
  );
}

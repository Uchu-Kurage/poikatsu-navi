import Link from "next/link";
import {
  sortedCampaigns,
  featuredCampaigns,
  campaignStatus,
  campaigns,
  categoryMeta,
  formatPeriod,
} from "@/data/campaigns";
import { getAllArticleMeta } from "@/lib/articles";
import { CampaignTimeline, TimelineItem } from "@/components/CampaignTimeline";

export default function HomePage() {
  const today = new Date();
  const items: TimelineItem[] = sortedCampaigns().map((campaign) => ({
    campaign,
    status: campaignStatus(campaign, today),
  }));
  const featured = featuredCampaigns().slice(0, 3);
  const activeCount = items.filter((i) => i.status.key !== "ended").length;
  const articles = getAllArticleMeta().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <span className="hero-eyebrow">🔔 毎日のポイント還元キャンペーンをまとめてチェック</span>
          <h1>
            <span className="hl">お得なキャンペーン</span>が<br />流れてくるタイムライン。
          </h1>
          <p className="lead">
            PayPay・楽天・dポイントから、クレカ・ふるさと納税・旅行まで。
            いま参加できるポイント還元キャンペーンを新着順のタイムラインで見逃さない。
          </p>
          <div className="hero-actions">
            <Link href="#timeline" className="btn btn-primary">タイムラインを見る →</Link>
            <Link href="/articles" className="btn btn-ghost">ポイ活の記事を読む</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">{campaigns.length}<span style={{ fontSize: 15 }}>件</span></div>
              <div className="label">掲載キャンペーン</div>
            </div>
            <div className="hero-stat">
              <div className="num">{activeCount}<span style={{ fontSize: 15 }}>件</span></div>
              <div className="label">いま参加できる</div>
            </div>
            <div className="hero-stat">
              <div className="num">{Object.keys(categoryMeta).length}<span style={{ fontSize: 15 }}>分野</span></div>
              <div className="label">幅広くカバー</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section container">
        <div className="section-head">
          <div>
            <h2>注目のキャンペーン</h2>
            <p className="sub">いま特に見逃せない高還元・大型キャンペーン</p>
          </div>
        </div>
        <div className="featured-grid">
          {featured.map((c) => {
            const st = campaignStatus(c, today);
            return (
              <Link href={`/campaigns/${c.id}`} key={c.id} className="featured-card">
                <div className="fc-glow" style={{ background: categoryMeta[c.category].color }} />
                <div className="cc-top">
                  <span className="cc-provider" style={{ background: c.providerColor }}>{c.provider}</span>
                  <span className={`cc-status st-${st.key}`}>{st.label}</span>
                </div>
                <div className="fc-reward" style={{ color: categoryMeta[c.category].color }}>{c.reward}</div>
                <h3 className="fc-title">{c.title}</h3>
                <div className="cc-foot">
                  <span>🗓 {formatPeriod(c)}</span>
                  <span className="cc-more">詳細を見る →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="section container" id="timeline" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>キャンペーン・タイムライン</h2>
            <p className="sub">新着順に流れるポイント還元情報。カテゴリや開催状況で絞り込めます</p>
          </div>
        </div>
        <CampaignTimeline items={items} />
      </section>

      {/* Articles */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>ポイ活お役立ち記事</h2>
            <p className="sub">キャンペーンを賢く使いこなすためのコツ</p>
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

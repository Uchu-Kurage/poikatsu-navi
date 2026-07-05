"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Campaign,
  CampaignCategory,
  CampaignStatus,
  CampaignStatusKey,
  categories,
  categoryMeta,
  formatPeriod,
  formatPostedDate,
} from "@/data/campaigns";

export type TimelineItem = {
  campaign: Campaign;
  status: CampaignStatus;
};

type StatusFilter = "all" | "active" | "ending";

const statusFilters: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "active", label: "開催中・予定" },
  { key: "ending", label: "終了間近" },
];

const statusClass: Record<CampaignStatusKey, string> = {
  upcoming: "st-upcoming",
  active: "st-active",
  soon: "st-soon",
  ended: "st-ended",
};

export function CampaignTimeline({ items }: { items: TimelineItem[] }) {
  const [category, setCategory] = useState<CampaignCategory | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return items.filter(({ campaign, status: st }) => {
      if (category !== "all" && campaign.category !== category) return false;
      if (status === "active" && (st.key === "ended")) return false;
      if (status === "ending" && st.key !== "soon") return false;
      return true;
    });
  }, [items, category, status]);

  const groups = useMemo(() => {
    const map = new Map<string, TimelineItem[]>();
    for (const it of filtered) {
      const arr = map.get(it.campaign.postedAt) ?? [];
      arr.push(it);
      map.set(it.campaign.postedAt, arr);
    }
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, list]) => ({ date, list }));
  }, [filtered]);

  return (
    <div>
      <div className="tl-filters">
        <div className="filter-row" role="group" aria-label="開催状況で絞り込み">
          {statusFilters.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`filter-chip ${status === s.key ? "active" : ""}`}
              onClick={() => setStatus(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="filter-row" role="group" aria-label="カテゴリで絞り込み">
          <button
            type="button"
            className={`filter-chip ${category === "all" ? "active" : ""}`}
            onClick={() => setCategory("all")}
          >
            全カテゴリ
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {categoryMeta[c].emoji} {c}
            </button>
          ))}
        </div>
      </div>

      <p className="tl-count">{filtered.length}件のキャンペーン</p>

      {groups.length === 0 ? (
        <p className="tl-empty">条件に合うキャンペーンがありません。フィルターを変えてみてください。</p>
      ) : (
        <div className="timeline">
          {groups.map((g) => (
            <section className="tl-group" key={g.date}>
              <div className="tl-date">
                <span className="tl-dot" aria-hidden />
                {formatPostedDate(g.date)}
              </div>
              <div className="tl-items">
                {g.list.map(({ campaign, status: st }) => (
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    key={campaign.id}
                    className="campaign-card"
                  >
                    <div className="cc-top">
                      <span
                        className="cc-provider"
                        style={{ background: campaign.providerColor }}
                      >
                        {campaign.provider}
                      </span>
                      <span className={`cc-status ${statusClass[st.key]}`}>{st.label}</span>
                    </div>
                    <div className="cc-main">
                      <div className="cc-reward" style={{ color: categoryMeta[campaign.category].color }}>
                        {campaign.reward}
                      </div>
                      <h3 className="cc-title">{campaign.title}</h3>
                    </div>
                    <p className="cc-summary">{campaign.summary}</p>
                    <div className="cc-tags">
                      <span className="cc-cat">
                        {categoryMeta[campaign.category].emoji} {campaign.category}
                      </span>
                      {campaign.tags.slice(0, 2).map((t) => (
                        <span className="cc-tag" key={t}>#{t}</span>
                      ))}
                    </div>
                    <div className="cc-foot">
                      <span>🗓 {formatPeriod(campaign)}</span>
                      <span className="cc-more">詳細を見る →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

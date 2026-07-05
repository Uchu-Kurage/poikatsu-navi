// ポイントサイトの比較・ランキングデータ
// ※還元率・レートはサンプル値です。実運用時は各公式サイトの最新情報を反映してください。

export type PointSite = {
  id: string;
  name: string;
  // ポイントの円換算レート（例: 1pt = 1円 なら 1、10pt = 1円 なら 0.1）
  yenPerPoint: number;
  minWithdrawYen: number; // 最低交換額（円）
  // 主要案件カテゴリでの体感還元の目安（★1〜5）
  ratings: {
    creditCard: number; // クレカ発行
    shopping: number; // ネットショッピング
    survey: number; // アンケート
    game: number; // ゲーム・アプリ
  };
  friendBonus: string; // 友達紹介の特典
  strengths: string[];
  officialUrl: string;
  color: string; // ブランドカラー（バッジ用）
};

export const sites: PointSite[] = [
  {
    id: "moppy",
    name: "モッピー",
    yenPerPoint: 1,
    minWithdrawYen: 300,
    ratings: { creditCard: 5, shopping: 4, survey: 4, game: 5 },
    friendBonus: "紹介で最大300pt＋ダウン報酬",
    strengths: ["高額案件が豊富", "1pt=1円で分かりやすい", "スマホ案件に強い"],
    officialUrl: "https://pc.moppy.jp/",
    color: "#7c3aed",
  },
  {
    id: "hapitas",
    name: "ハピタス",
    yenPerPoint: 1,
    minWithdrawYen: 300,
    ratings: { creditCard: 5, shopping: 5, survey: 3, game: 3 },
    friendBonus: "紹介で最大400pt",
    strengths: ["ネットショッピング還元が高い", "買い物保証あり", "老舗の安心感"],
    officialUrl: "https://hapitas.jp/",
    color: "#e11d48",
  },
  {
    id: "pointincome",
    name: "ポイントインカム",
    yenPerPoint: 0.1,
    minWithdrawYen: 500,
    ratings: { creditCard: 5, shopping: 4, survey: 4, game: 5 },
    friendBonus: "紹介＋ティア報酬10%",
    strengths: ["会員ランク制度がお得", "ゲーム・アプリ案件が豊富", "交換先が多い"],
    officialUrl: "https://pointi.jp/",
    color: "#0ea5e9",
  },
  {
    id: "chirashi",
    name: "ちょびリッチ",
    yenPerPoint: 0.5,
    minWithdrawYen: 500,
    ratings: { creditCard: 4, shopping: 4, survey: 5, game: 4 },
    friendBonus: "紹介で最大500円分＋ティア40%",
    strengths: ["アンケート・モニターが充実", "ティア報酬が高い", "毎日スロットあり"],
    officialUrl: "https://www.chobirich.com/",
    color: "#f59e0b",
  },
  {
    id: "warau",
    name: "ワラウ",
    yenPerPoint: 0.1,
    minWithdrawYen: 500,
    ratings: { creditCard: 4, shopping: 3, survey: 4, game: 5 },
    friendBonus: "紹介で最大3,500pt",
    strengths: ["ゲーム・ミニコンテンツが多い", "毎日のログイン特典", "初心者向けキャンペーン"],
    officialUrl: "https://www.warau.jp/",
    color: "#22c55e",
  },
  {
    id: "ecnavi",
    name: "ECナビ",
    yenPerPoint: 0.1,
    minWithdrawYen: 300,
    ratings: { creditCard: 4, shopping: 5, survey: 5, game: 3 },
    friendBonus: "紹介＋ティア報酬",
    strengths: ["ショッピング経由で高還元", "アンケート案件が豊富", "PeXへ交換しやすい"],
    officialUrl: "https://ecnavi.jp/",
    color: "#3b82f6",
  },
];

// 各サイトの総合スコア（★平均）を算出
export function overallScore(site: PointSite): number {
  const r = site.ratings;
  const avg = (r.creditCard + r.shopping + r.survey + r.game) / 4;
  return Math.round(avg * 10) / 10;
}

// 総合スコア順にソートしたランキングを返す
export function rankedSites(): PointSite[] {
  return [...sites].sort((a, b) => overallScore(b) - overallScore(a));
}

export function getSite(id: string): PointSite | undefined {
  return sites.find((s) => s.id === id);
}

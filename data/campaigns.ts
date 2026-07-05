// ポイント還元キャンペーン情報のタイムライン用データ
// ※還元率・期間・条件にはサンプル値が含まれます。実運用時は各公式サイトの最新情報を反映してください。

export type CampaignCategory =
  | "キャッシュレス決済"
  | "ネット通販"
  | "クレジットカード"
  | "旅行・交通"
  | "コンビニ・スーパー"
  | "ふるさと納税"
  | "投資・金融"
  | "アプリ・エンタメ";

export type Campaign = {
  id: string;
  title: string;
  provider: string; // 提供元サービス（PayPay、楽天ポイント など）
  providerColor: string; // 提供元のブランドカラー
  category: CampaignCategory;
  reward: string; // 目立たせる還元表記（例: 最大20%還元 / 10,000pt）
  summary: string; // 概要
  postedAt: string; // タイムライン掲載日 YYYY-MM-DD（並び順の基準）
  startDate: string; // キャンペーン開始日 YYYY-MM-DD
  endDate: string; // キャンペーン終了日 YYYY-MM-DD
  url: string; // 情報元・公式ページ
  tags: string[];
  highlight?: boolean; // 注目キャンペーン
  details: string[]; // 参加条件・注意点
};

export const categoryMeta: Record<CampaignCategory, { emoji: string; color: string }> = {
  キャッシュレス決済: { emoji: "📱", color: "#ef4444" },
  ネット通販: { emoji: "🛒", color: "#f97316" },
  クレジットカード: { emoji: "💳", color: "#6366f1" },
  "旅行・交通": { emoji: "✈️", color: "#0ea5e9" },
  "コンビニ・スーパー": { emoji: "🏪", color: "#22c55e" },
  ふるさと納税: { emoji: "🎁", color: "#e11d48" },
  "投資・金融": { emoji: "📈", color: "#14b8a6" },
  "アプリ・エンタメ": { emoji: "🎮", color: "#a855f7" },
};

export const categories = Object.keys(categoryMeta) as CampaignCategory[];

export const campaigns: Campaign[] = [
  {
    id: "paypay-super-jumbo-2026-07",
    title: "PayPayジャンボ 街のお店で最大全額還元",
    provider: "PayPay",
    providerColor: "#ff0033",
    category: "キャッシュレス決済",
    reward: "最大全額",
    summary:
      "対象の街のお店でPayPay決済すると、抽選で決済額の最大100%（上限10万円相当）が戻ってくる恒例のジャンボ企画。",
    postedAt: "2026-07-04",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    url: "https://paypay.ne.jp/",
    tags: ["PayPay", "抽選", "街のお店"],
    highlight: true,
    details: [
      "対象はPayPayステップ条件を満たすユーザー",
      "付与上限は1回あたり10万円相当・期間合計30万円相当",
      "PayPayカード以外のクレジットは対象外の場合あり",
    ],
  },
  {
    id: "rakuten-okaimono-marathon-2026-07",
    title: "楽天お買い物マラソン ショップ買い回りで最大10倍",
    provider: "楽天ポイント",
    providerColor: "#bf0000",
    category: "ネット通販",
    reward: "最大+9倍",
    summary:
      "期間中に複数ショップで買い回るほど楽天ポイント倍率がアップ。10ショップ達成で+9倍（合計10倍）まで積み上がる。",
    postedAt: "2026-07-04",
    startDate: "2026-07-04",
    endDate: "2026-07-11",
    url: "https://event.rakuten.co.jp/",
    tags: ["楽天市場", "買い回り", "SPU"],
    highlight: true,
    details: [
      "1ショップ1,000円（税込）以上の購入でカウント",
      "獲得ポイント上限は7,000ポイント",
      "エントリー必須。SPUと併用可能",
    ],
  },
  {
    id: "dpoint-40x-drugstore-2026-07",
    title: "dポイント 対象ドラッグストアで最大40%還元",
    provider: "dポイント",
    providerColor: "#cc0033",
    category: "コンビニ・スーパー",
    reward: "最大40%",
    summary:
      "対象ドラッグストアでd払い＋dポイントカード提示すると、抽選で最大40%相当のdポイントを還元。",
    postedAt: "2026-07-03",
    startDate: "2026-07-07",
    endDate: "2026-07-21",
    url: "https://dpoint.docomo.ne.jp/",
    tags: ["d払い", "ドラッグストア", "抽選"],
    details: [
      "要エントリー（キャンペーンページから）",
      "付与上限は期間合計3,000ポイント",
      "dカード支払い設定で当選確率アップ",
    ],
  },
  {
    id: "aupay-triple-2026-07",
    title: "au PAY たぬきの大恩返し 三太郎の日は最大10%",
    provider: "au PAY",
    providerColor: "#eb5505",
    category: "キャッシュレス決済",
    reward: "最大10%",
    summary:
      "毎月3・13・23日の三太郎の日に、au PAY / au PAY カード利用でPontaポイントを上乗せ還元。",
    postedAt: "2026-07-02",
    startDate: "2026-07-03",
    endDate: "2026-07-23",
    url: "https://aupay.wallet.auone.jp/",
    tags: ["三太郎の日", "Ponta", "au"],
    details: [
      "要エントリー（毎回）",
      "au/UQ会員は還元率が優遇",
      "1回あたりの付与上限あり",
    ],
  },
  {
    id: "amazon-prime-day-2026-07",
    title: "Amazonプライムデー ポイントアップキャンペーン",
    provider: "Amazon",
    providerColor: "#ff9900",
    category: "ネット通販",
    reward: "最大12%",
    summary:
      "プライム会員向けのビッグセール。合計1万円以上の買い物＋各種条件達成でポイント還元率が最大12%までアップ。",
    postedAt: "2026-07-02",
    startDate: "2026-07-15",
    endDate: "2026-07-16",
    url: "https://www.amazon.co.jp/",
    tags: ["プライムデー", "セール", "ポイントアップ"],
    highlight: true,
    details: [
      "プライム会員限定（無料体験でも参加可）",
      "要エントリー。Amazonギフトカードチャージで+0.5%〜",
      "還元上限は10,000ポイント",
    ],
  },
  {
    id: "vpoint-smbc-tokka-2026-07",
    title: "Vポイント 対象コンビニ・飲食店で最大7%還元",
    provider: "Vポイント",
    providerColor: "#0068b7",
    category: "コンビニ・スーパー",
    reward: "最大7%",
    summary:
      "三井住友カード（NL）を対象店舗でスマホのタッチ決済すると、いつでも最大7%相当のVポイントが還元。",
    postedAt: "2026-07-01",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    url: "https://www.smbc-card.com/",
    tags: ["三井住友カード", "タッチ決済", "常時開催"],
    details: [
      "スマホのタッチ決済（Apple Pay / Google Pay）が対象",
      "対象は主要コンビニ・マクドナルドなど",
      "家族ポイント・学生ポイントで還元率さらにアップ",
    ],
  },
  {
    id: "jre-point-shinkansen-2026-07",
    title: "JRE POINT えきねっとチケットレスで10%還元",
    provider: "JRE POINT",
    providerColor: "#00ac9a",
    category: "旅行・交通",
    reward: "10%還元",
    summary:
      "えきねっとの新幹線eチケット（チケットレス）利用で、乗車ポイントとは別にJRE POINTを10%還元。",
    postedAt: "2026-06-30",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    url: "https://www.jrepoint.jp/",
    tags: ["新幹線", "えきねっと", "夏の旅行"],
    details: [
      "要エントリー＋Suica連携",
      "付与は乗車月の翌々月",
      "一部の割引きっぷは対象外",
    ],
  },
  {
    id: "satofull-furusato-2026-07",
    title: "さとふる 夏のふるさと納税 最大12%ポイント還元",
    provider: "さとふる",
    providerColor: "#f5a623",
    category: "ふるさと納税",
    reward: "最大12%",
    summary:
      "夏の大型キャンペーン。寄付金額とエントリー条件に応じて、PayPayポイントなどを最大12%還元。",
    postedAt: "2026-06-29",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    url: "https://www.satofull.jp/",
    tags: ["ふるさと納税", "PayPayポイント", "夏"],
    details: [
      "要エントリー。寄付回数・金額で還元率が段階的にアップ",
      "アプリからの寄付で還元率上乗せ",
      "ポイント付与のルールは2025年10月以降の制度に準拠",
    ],
  },
  {
    id: "rakuten-securities-toshin-2026-06",
    title: "楽天証券 投信積立カード決済で最大1%ポイント",
    provider: "楽天ポイント",
    providerColor: "#bf0000",
    category: "投資・金融",
    reward: "最大1%",
    summary:
      "楽天カードでの投信積立に応じて楽天ポイントを付与。新規口座開設＆エントリーで期間限定ポイントも上乗せ。",
    postedAt: "2026-06-28",
    startDate: "2026-06-01",
    endDate: "2026-07-31",
    url: "https://www.rakuten-sec.co.jp/",
    tags: ["新NISA", "投信積立", "楽天カード"],
    details: [
      "還元率はカード種別・ファンドの信託報酬で変動",
      "口座開設キャンペーンは要エントリー",
      "投資は自己責任。元本保証はありません",
    ],
  },
  {
    id: "merpay-half-2026-06",
    title: "メルペイ 対象のお店で20%ポイント還元",
    provider: "メルカリ",
    providerColor: "#ff0211",
    category: "キャッシュレス決済",
    reward: "20%還元",
    summary:
      "メルカリの売上金・メルペイ残高払いで、対象店舗の支払いが20%還元に。クーポン取得でさらにお得。",
    postedAt: "2026-06-27",
    startDate: "2026-06-27",
    endDate: "2026-07-06",
    url: "https://jp.mercari.com/",
    tags: ["メルペイ", "クーポン", "残高払い"],
    details: [
      "アプリでクーポンの取得が必要",
      "付与上限は期間合計1,500ポイント",
      "メルカリの売上金を消化したい人向け",
    ],
  },
  {
    id: "ponta-lawson-app-2026-06",
    title: "ローソンアプリ Ponta・dポイント最大5%還元",
    provider: "Ponta",
    providerColor: "#0a4c9a",
    category: "コンビニ・スーパー",
    reward: "最大5%",
    summary:
      "ローソンアプリのクーポン＆スタンプで、対象商品購入時にPonta/dポイントを最大5%分還元。",
    postedAt: "2026-06-26",
    startDate: "2026-06-24",
    endDate: "2026-07-07",
    url: "https://www.lawson.co.jp/",
    tags: ["ローソン", "アプリクーポン", "コンビニ"],
    details: [
      "ローソンアプリのダウンロードとログインが必要",
      "対象商品はアプリ内で毎週更新",
      "他クーポンとの併用不可の場合あり",
    ],
  },
  {
    id: "line-pay-migration-2026-06",
    title: "LINEポイント 友だち追加＆決済で300pt",
    provider: "LINEポイント",
    providerColor: "#06c755",
    category: "アプリ・エンタメ",
    reward: "300pt",
    summary:
      "対象公式アカウントの友だち追加とPayPay/LINE連携での初回決済で、もれなくLINEポイントを300pt付与。",
    postedAt: "2026-06-25",
    startDate: "2026-06-20",
    endDate: "2026-07-10",
    url: "https://www.linebiz.com/jp/",
    tags: ["LINE", "友だち追加", "初回限定"],
    details: [
      "対象は初回利用ユーザー",
      "付与は決済月の翌月末ごろ",
      "予算上限に達し次第終了",
    ],
  },
  {
    id: "epos-card-shinki-2026-06",
    title: "エポスカード 新規入会＆利用で最大8,000pt",
    provider: "エポスポイント",
    providerColor: "#003e92",
    category: "クレジットカード",
    reward: "最大8,000pt",
    summary:
      "エポスカード新規入会と対象期間の利用で、エポスポイントを最大8,000ポイント（8,000円相当）プレゼント。",
    postedAt: "2026-06-24",
    startDate: "2026-06-01",
    endDate: "2026-07-31",
    url: "https://www.eposcard.co.jp/",
    tags: ["新規入会", "年会費無料", "クレカ"],
    details: [
      "入会後の利用金額・条件達成でポイントが段階付与",
      "紹介経由でさらにボーナスポイント",
      "審査があります。発行には日数がかかる場合あり",
    ],
  },
  {
    id: "ana-pay-summer-2026-06",
    title: "ANA Pay 夏のマイル最大5%還元キャンペーン",
    provider: "ANAマイル",
    providerColor: "#13448f",
    category: "旅行・交通",
    reward: "最大5%",
    summary:
      "ANA Payのコード決済・タッチ決済利用で、通常のマイルに加えて対象期間はボーナスマイルを上乗せ。",
    postedAt: "2026-06-22",
    startDate: "2026-06-15",
    endDate: "2026-07-05",
    url: "https://www.ana.co.jp/",
    tags: ["ANA", "マイル", "コード決済"],
    details: [
      "要エントリー＋ANAアプリの利用",
      "付与上限は期間合計2,000マイル",
      "本日が最終日。エントリー忘れに注意",
    ],
  },
  {
    id: "welcia-otoku-day-2026-06",
    title: "ウエルシア お客様感謝デー ポイント1.5倍利用",
    provider: "WAON POINT",
    providerColor: "#e60012",
    category: "コンビニ・スーパー",
    reward: "1.5倍分お得",
    summary:
      "毎月20日はTポイント/WAON POINTが1.5倍分の買い物に使える「ウエル活」定番デー。実質約33%オフ。",
    postedAt: "2026-06-20",
    startDate: "2026-06-20",
    endDate: "2026-06-20",
    url: "https://www.welcia.co.jp/",
    tags: ["ウエル活", "毎月20日", "実質33%オフ"],
    details: [
      "200ポイント以上の利用で1.5倍換算",
      "対象はVポイント/WAON POINT",
      "次回開催は翌月20日",
    ],
  },
  {
    id: "majica-donki-2026-06",
    title: "majica ドン・キホーテで最大3%ポイントアップ",
    provider: "majica",
    providerColor: "#ffcc00",
    category: "コンビニ・スーパー",
    reward: "最大3%",
    summary:
      "majica会員ランクと電子マネーチャージ利用で、ドン・キホーテグループでのポイント付与率が最大3%にアップ。",
    postedAt: "2026-06-18",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    url: "https://www.majica-net.com/",
    tags: ["ドンキ", "majica", "電子マネー"],
    details: [
      "majicaアプリの会員登録が必要",
      "会員ランクで還元率が変動",
      "一部対象外商品あり",
    ],
  },
];

// 日付文字列（YYYY-MM-DD）を数値に変換して比較
function dayNumber(dateStr: string): number {
  return Date.parse(`${dateStr}T00:00:00+09:00`);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type CampaignStatusKey = "upcoming" | "active" | "soon" | "ended";

export type CampaignStatus = {
  key: CampaignStatusKey;
  label: string;
  daysLeft: number | null; // 終了までの残り日数（終了済みはnull）
};

// 今日を基準にキャンペーンの開催状況を判定
export function campaignStatus(c: Campaign, today: Date = new Date()): CampaignStatus {
  const todayNum = dayNumber(today.toISOString().slice(0, 10));
  const start = dayNumber(c.startDate);
  const end = dayNumber(c.endDate);

  if (todayNum < start) {
    const days = Math.ceil((start - todayNum) / MS_PER_DAY);
    return { key: "upcoming", label: "開催予定", daysLeft: days };
  }
  if (todayNum > end) {
    return { key: "ended", label: "受付終了", daysLeft: null };
  }
  const daysLeft = Math.round((end - todayNum) / MS_PER_DAY);
  if (daysLeft <= 3) {
    return { key: "soon", label: daysLeft <= 0 ? "本日まで" : `残り${daysLeft}日`, daysLeft };
  }
  return { key: "active", label: "開催中", daysLeft };
}

// タイムライン順（掲載日の新しい順、同日はキャンペーン終了が近い順）にソート
export function sortedCampaigns(list: Campaign[] = campaigns): Campaign[] {
  return [...list].sort((a, b) => {
    if (a.postedAt !== b.postedAt) return a.postedAt < b.postedAt ? 1 : -1;
    return dayNumber(a.endDate) - dayNumber(b.endDate);
  });
}

export function featuredCampaigns(): Campaign[] {
  return sortedCampaigns(campaigns.filter((c) => c.highlight));
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

// 掲載日ごとにグループ化（タイムライン表示用）
export function groupByPostedDate(
  list: Campaign[]
): { date: string; items: Campaign[] }[] {
  const map = new Map<string, Campaign[]>();
  for (const c of list) {
    const arr = map.get(c.postedAt) ?? [];
    arr.push(c);
    map.set(c.postedAt, arr);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({ date, items }));
}

// 「2026-07-04」→「7月4日(土)」表記
const WD = ["日", "月", "火", "水", "木", "金", "土"];
export function formatPostedDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00+09:00`);
  return `${d.getMonth() + 1}月${d.getDate()}日(${WD[d.getDay()]})`;
}

export function formatPeriod(c: Campaign): string {
  const f = (s: string) => {
    const d = new Date(`${s}T00:00:00+09:00`);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };
  return c.startDate === c.endDate ? f(c.startDate) : `${f(c.startDate)} 〜 ${f(c.endDate)}`;
}

import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/Layout";

export const metadata: Metadata = {
  title: {
    default: "ポイ活ナビ | ポイント還元キャンペーンのタイムライン",
    template: "%s | ポイ活ナビ",
  },
  description:
    "PayPay・楽天・dポイントからクレカ・ふるさと納税・旅行まで、いま参加できるポイント還元キャンペーンを新着順のタイムラインでまとめてチェックできるキュレーションメディア。",
  keywords: ["ポイ活", "ポイント還元", "キャンペーン", "PayPay", "楽天ポイント", "dポイント", "キャッシュレス"],
  openGraph: {
    title: "ポイ活ナビ",
    description: "いま参加できるポイント還元キャンペーンを新着順のタイムラインでまとめてチェック。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

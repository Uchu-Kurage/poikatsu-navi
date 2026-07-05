import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/Layout";

export const metadata: Metadata = {
  title: {
    default: "ポイ活ナビ | ポイントサイト比較・お得情報キュレーション",
    template: "%s | ポイ活ナビ",
  },
  description:
    "ポイントサイトの還元率ランキング、初心者向けの始め方、稼ぎ方のコツをまとめたポイ活キュレーションメディア。あなたに合ったポイ活を見つけよう。",
  keywords: ["ポイ活", "ポイントサイト", "還元率", "比較", "ランキング", "モッピー", "ハピタス"],
  openGraph: {
    title: "ポイ活ナビ",
    description: "ポイントサイトの還元率ランキングとお得情報のキュレーションメディア。",
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

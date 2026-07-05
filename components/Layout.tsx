import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="ポイ活ナビ ホーム">
          <span className="brand-mark" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.5a2.5 2.5 0 1 1 3 3.9V15" />
              <path d="M12 17.5v.01" />
            </svg>
          </span>
          <span>ポイ活ナビ</span>
        </Link>
        <nav className="nav">
          <Link href="/#timeline">タイムライン</Link>
          <Link href="/articles">記事一覧</Link>
          <Link href="/#timeline" className="cta">キャンペーンを探す</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div style={{ fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>ポイ活ナビ</div>
          <p className="disclaimer">
            当サイトはポイント還元キャンペーン情報をタイムライン形式でまとめたキュレーションメディアです。掲載している還元率・期間・条件はサンプルを含み、
            実際の内容は各公式ページの最新情報をご確認ください。キャンペーンによっては広告リンクを含む場合があります。
          </p>
        </div>
        <div>© {new Date().getFullYear()} ポイ活ナビ</div>
      </div>
    </footer>
  );
}

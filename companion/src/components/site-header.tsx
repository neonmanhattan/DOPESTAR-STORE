import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link aria-label="DopeStar Store companion home" className="brand" href="/">
        <span className="brand-mark">D</span>
        <span className="brand-copy">
          <strong>DopeStar</strong>
          <small>STORE · KAMPALA</small>
        </span>
      </Link>
      <nav aria-label="Main navigation" className="main-nav">
        <Link href="/size-guide">Size guide</Link>
        <Link href="/style-finder">Style finder</Link>
        <Link className="nav-track" href="/track-order">Track order</Link>
      </nav>
    </header>
  );
}

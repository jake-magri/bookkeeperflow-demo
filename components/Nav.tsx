import Link from "next/link";

export function Nav() {
  return (
    <nav className="nav">
      <Link className="logo" href="/">
        <strong>BookkeeperFlow</strong>
        <span>Document collection workflow</span>
      </Link>
      <div className="nav-links">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/client-portal">Client Link</Link>
        <Link href="/settings">Settings</Link>
        <Link href="/setup">Setup</Link>
        <Link href="/docs/workflow-map.md">Workflow Map</Link>
        <Link className="cta-link" href="/#demo">View Demo</Link>
      </div>
    </nav>
  );
}

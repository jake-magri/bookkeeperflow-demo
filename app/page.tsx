import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { WorkflowMap } from "@/components/WorkflowMap";
import { getDashboardMetrics } from "@/lib/automation";
import { StatCard } from "@/components/StatCard";

export default function Home() {
  const metrics = getDashboardMetrics();

  return (
    <main className="page-shell">
      <Nav />
      <section className="container hero">
        <div>
          <span className="eyebrow">Portfolio demo · bookkeeping workflow automation</span>
          <h1>Stop chasing clients for monthly documents.</h1>
          <p>
            BookkeeperFlow is a lightweight demo system that shows how bookkeeping firms can collect documents,
            track missing items, collect client submission confirmations, verify files in Drive/SharePoint, and see which clients are ready for month-end close.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" href="/dashboard">Open dashboard</Link>
            <Link className="btn btn-secondary" href="/client-portal">View client portal</Link>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <strong>Workflow snapshot</strong>
            <span>June close</span>
          </div>
          <div className="panel-body grid">
            <StatCard label="Clients tracked" value={metrics.clients} detail="Recurring bookkeeping clients in this demo." />
            <StatCard label="Ready for close" value={metrics.ready} detail="No missing documents remaining." />
            <StatCard label="Missing items" value={metrics.missing} detail="Need follow-up before close." />
          </div>
        </div>
      </section>

      <section className="container section" id="demo">
        <div className="section-header">
          <h2>Built like a service business deliverable.</h2>
          <p>
            The app is intentionally simple: a UI for bookkeepers, a secure client request link, a Drive/SharePoint-friendly submission tracker, and an automation layer that can be powered by n8n, Zapier, Make, or Power Automate.
          </p>
        </div>
        <WorkflowMap />
      </section>

      <section className="container section">
        <div className="grid grid-3">
          <article className="card">
            <h3>Low-code first</h3>
            <p>Use forms, folders, spreadsheets, reminders, and workflow tools before writing custom software.</p>
          </article>
          <article className="card">
            <h3>Spot-code when needed</h3>
            <p>Add APIs, scripts, custom UI, and data models only when the workflow actually needs them.</p>
          </article>
          <article className="card">
            <h3>Human approval</h3>
            <p>AI can draft follow-ups and summaries, but bookkeepers review sensitive communications before sending.</p>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}

# BookkeeperFlow

**Monthly Client Document Collection System**

BookkeeperFlow is a portfolio demo for bookkeeping workflow automation. It shows how a bookkeeping or accounting firm could reduce client-chasing, track missing documents, collect client submission confirmations, verify files in a firm-controlled Drive/SharePoint folder, send reminders, and see which clients are ready for month-end close.

The goal is not to build a huge SaaS product. The goal is to create a clean, sellable demo that proves the workflow automation offer:

> Low-code first. Custom code only when the workflow actually needs it.

## Why this exists

Bookkeeping firms often waste time each month chasing clients for required documents such as bank statements, receipts, invoices, payroll reports, and credit card statements. The work usually happens across email, folders, spreadsheets, and memory.

This project models a better workflow:

1. Create monthly client document requests.
2. Give clients a secure request link.
3. Send clients to the firm-controlled Drive/SharePoint upload folder.
4. Let clients mark requested items as submitted.
5. Let bookkeepers verify, review, or request replacement documents.
6. Generate reminder emails for missing items.
7. Log automation events from tools like n8n, Zapier, Make, or Power Automate.

## Tech stack

- **Next.js**
- **TypeScript**
- **CSS**
- **Browser localStorage state for the V2 configurable sales demo**
- **Mock webhook endpoint for n8n/Zapier/Make integration**

Future additions can include:

- Supabase/Postgres
- n8n cloud/self-hosted workflows
- Zapier or Make scenarios
- Power Automate version for Microsoft clients
- OpenAI or Claude API for follow-up drafting and weekly summaries

## Getting started

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful routes:

```text
/                 Landing page
/dashboard        Bookkeeper dashboard
/client-portal    Mock client upload portal
/settings         Firm storage/settings page
/setup            Fast setup wizard for pilot clients
/api/webhooks/n8n Mock webhook receiver
```

## Project structure

```text
bookkeeperflow-demo/
  app/
    page.tsx
    dashboard/page.tsx
    client-portal/page.tsx
    api/webhooks/n8n/route.ts
    globals.css
  components/
    AutomationTimeline.tsx
    ClientSubmissionDemo.tsx
    DashboardWorkflowDemo.tsx
    ClientTable.tsx
    DocumentChecklist.tsx
    EmailDraftPanel.tsx
    Footer.tsx
    Nav.tsx
    StatCard.tsx
    WorkflowMap.tsx
  lib/
    automation.ts
    demoState.ts
    sampleData.ts
    types.ts
  docs/
    workflow-map.md
    implementation-notes.md
    sales-one-pager.md
    n8n-workflow-export.json
```

## Demo workflow

### Bookkeeper dashboard

The dashboard shows:

- active clients
- clients ready for close
- submitted items needing verification
- missing / rejected / overdue document count
- external folder link pattern
- custom document type concept
- client readiness table
- document request queue with verify, review, and request-again actions
- AI-assisted follow-up draft
- automation event timeline

### Client portal mock

The client portal shows what a client would see when they receive a secure request link. The client opens the firm-controlled upload folder, uploads files there, then marks each checklist item as submitted. The dashboard does not treat a link click as proof of upload; the bookkeeper verifies submitted items.

### n8n webhook mock

The app includes a webhook endpoint:

```text
POST /api/webhooks/n8n
```

Send a test payload:

```bash
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{"clientId":"c-003","documentName":"Vendor invoices","status":"overdue"}'
```

This returns a JSON response and demonstrates where low-code automation tools would push workflow events.

## Suggested development roadmap

### Version 1: Portfolio demo

- Static data
- Polished UI
- Dashboard
- Client portal mock
- Reminder email draft
- Automation log
- n8n workflow export

### Version 1.5: Safer pilot workflow

- Interactive localStorage demo state
- Firm-controlled Drive/SharePoint upload folder link
- Client self-confirms submitted items
- Bookkeeper verifies, reviews, or requests replacement files
- Custom document type concept

### Version 2: Configurable sales demo

- Setup wizard for firm name, storage root, default period, due date, pilot clients, and document types
- One-click generation of client request links and document checklists
- LocalStorage-backed client/request configuration so you can customize the demo without editing code
- Import/export setup JSON for reuse during paid audits

### Version 3: Real data

- Add Supabase/Postgres
- Add bookkeeper login
- Persist clients, document requests, and request item status across users/devices
- Add secure request tokens
- Save automation events from webhook

### Version 4: Automation integration

- Connect n8n, Zapier, Make, or Power Automate
- Send real reminder emails
- Generate weekly bookkeeper summaries
- Add OpenAI/Claude-generated follow-up drafts
- Add Loom walkthrough for portfolio

### Version 5: Consulting template

- Cloneable starter for client projects
- Configurable document checklists
- Firm branding
- Microsoft 365 / Google Workspace variants
- SOP handoff documentation

## Consulting positioning

This demo now supports a productized service flow: configure the firm, generate pilot client links, demo the workflow, and sell setup before building a full backend. It supports a service offer like:

**Monthly Client Document Collection System**

For bookkeeping firms that spend too much time chasing clients for statements, receipts, payroll reports, invoices, and missing files.

Possible pricing ladder:

- Workflow Cleanup Audit: **$750**
- Starter Automation Build: **$3,000**
- Standard Workflow System: **$5,000**
- Advanced Workflow System: **$8,000+**
- Monthly Support: **$750-$1,500/month**

## Important safety boundary

This demo automates workflow status and communication patterns. For real clients, the safer first pilot is to keep sensitive files in the bookkeeping firm's existing Google Drive, SharePoint, Dropbox, or client portal and store only process metadata in the app. Do not process sensitive financial data, tax records, bank feeds, payroll data, or personally identifiable information without proper contracts, data handling practices, access controls, and client approval.

Start with process metadata and admin workflows. Bring in an accountant, bookkeeper, CPA, attorney, or security professional when the work crosses into regulated or sensitive areas.

## Portfolio case study summary

**Problem:** Bookkeeping firms waste time chasing clients for monthly documents.

**Solution:** A lightweight workflow system that tracks document requests, highlights missing items, drafts reminder emails, and logs automation events.

**Tools:** Next.js, TypeScript, low-code automation concept, n8n workflow export, AI-assisted drafting concept.

**Result:** Demonstrates how bookkeeping firms can reduce manual follow-up, improve month-end visibility, and create a repeatable client document collection process.

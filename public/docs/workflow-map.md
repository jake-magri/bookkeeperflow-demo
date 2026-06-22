# BookkeeperFlow Workflow Map

## Use case

Bookkeeping firms often lose time chasing clients for monthly documents. This demo models a simple operational system that makes the process visible and repeatable.

## Workflow

1. Bookkeeper creates a monthly document request.
2. Client receives a request email with a checklist and upload link.
3. Client uploads documents into a folder or portal.
4. Tracker updates submitted / missing / overdue status.
5. Missing items trigger reminders.
6. AI drafts a polite follow-up email for bookkeeper review.
7. Bookkeeper receives a weekly status summary.
8. Clients with all required documents are marked ready for month-end close.

## Low-code first architecture

- Intake and upload: Microsoft Forms, Google Forms, Jotform, or client portal.
- Storage: SharePoint, OneDrive, Google Drive, or Dropbox.
- Tracker: Excel, Google Sheets, Airtable, or Postgres/Supabase for a custom UI.
- Automation engine: Power Automate, Zapier, Make, or n8n.
- AI assist: ChatGPT, Claude, or OpenAI API for drafts and summaries.

## Custom code only when needed

Custom code may be useful for:

- a client portal UI
- API integrations
- secure role-based access
- more complex status logic
- custom dashboards
- multi-client data model
- webhook-based automation logs

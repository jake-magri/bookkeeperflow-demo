# Implementation Notes

## MVP goal

Build a portfolio-grade demo, not a full SaaS product. The project should prove that Jake can map a bookkeeping workflow, model the data, create a usable interface, connect to a low-code automation layer, and show the safer pilot pattern where files stay in the firm's existing Drive/SharePoint folder.

## Suggested implementation path

### Version 1

- Static sample data
- Dashboard
- Client readiness table
- Document request checklist
- AI-assisted follow-up draft
- Automation timeline

### Version 1.5

- Browser localStorage persistence for demo actions
- External Drive/SharePoint folder link stored on the monthly request
- Client marks checklist items as submitted after uploading to the external folder
- Bookkeeper verifies, reviews, rejects, or requests replacement documents
- Custom document type concept on the dashboard

### Version 2

- Setup wizard for fast implementation prep
- Configurable client list and document type list saved to localStorage
- One-click generation of client-specific request links and request items
- Import/export setup JSON for paid audit handoff or reuse

### Version 3

- Supabase/Postgres persistence
- Add/update clients
- Add/update document requests
- Basic bookkeeper authentication
- Secure request tokens
- Webhook endpoint that records automation events

### Version 4

- n8n workflow integration
- Email reminder flow
- Weekly summary flow
- OpenAI or Claude API for follow-up drafting
- Loom walkthrough and screenshots for portfolio

## Security and compliance notes

For real clients, avoid storing sensitive financial documents in the app until there is a proper agreement, permissions model, storage policy, and data handling plan. The first paid pilot can keep files in the firm's existing Google Drive, SharePoint, Dropbox, or client portal while this app tracks process metadata, checklist status, reminders, and verification state.


## Current monetization posture

This version is ready as a sales demo and implementation template. It is not yet a multi-user SaaS because client links still depend on local demo state. For a first paid client, sell a fixed-scope setup around the firm's existing Google Drive/SharePoint workflow. Add Supabase/auth only after a prospect pays for an audit or asks to pilot it with real clients across devices.

# Implementation Notes

## MVP goal

Build a portfolio-grade demo, not a full SaaS product. The project should prove that Jake can map a bookkeeping workflow, model the data, create a usable interface, and connect to a low-code automation layer.

## Suggested implementation path

### Version 1

- Static sample data
- Dashboard
- Client readiness table
- Document request checklist
- AI-assisted follow-up draft
- Automation timeline

### Version 2

- Supabase/Postgres persistence
- Add/update clients
- Add/update document requests
- Webhook endpoint that records automation events

### Version 3

- n8n workflow integration
- Email reminder flow
- Weekly summary flow
- OpenAI or Claude API for follow-up drafting
- Loom walkthrough and screenshots for portfolio

## Security and compliance notes

For real clients, avoid collecting sensitive financial data until there is a proper agreement, permissions model, storage policy, and data handling plan. Start by automating process metadata and non-sensitive workflow status before touching bank statements, payroll data, or tax records.

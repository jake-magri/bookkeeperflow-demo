import { buildReminderEmail } from "@/lib/automation";

export function EmailDraftPanel({ clientId }: { clientId: string }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <strong>AI-assisted follow-up draft</strong>
        <span>Human review before sending</span>
      </div>
      <div className="panel-body">
        <textarea readOnly value={buildReminderEmail(clientId)} />
      </div>
    </div>
  );
}

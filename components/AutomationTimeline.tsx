import type { AutomationEvent } from "@/lib/types";

export function AutomationTimeline({ events }: { events: AutomationEvent[] }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <strong>Automation timeline</strong>
        <span>n8n / Zapier style workflow log</span>
      </div>
      <div className="panel-body timeline">
        {events.map((event) => (
          <div className="timeline-item" key={event.id}>
            <span className="timeline-dot" />
            <div>
              <strong>{event.eventType.replaceAll("_", " ")}</strong>
              <p>{event.summary}</p>
              <p>{new Date(event.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

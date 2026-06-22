import type { Client } from "@/lib/types";
import { getClientReadiness } from "@/lib/automation";

export function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <strong>Client readiness tracker</strong>
        <span>Month-end status</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>Bookkeeper</th>
              <th>Documents</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const readiness = getClientReadiness(client.id);
              return (
                <tr key={client.id}>
                  <td><strong>{client.businessName}</strong></td>
                  <td>{client.contactName}<br /><span style={{ color: "var(--muted)" }}>{client.email}</span></td>
                  <td>{client.assignedBookkeeper}</td>
                  <td>{readiness.submitted}/{readiness.total || "—"} submitted</td>
                  <td><span className={`status status-${client.status}`}>{client.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

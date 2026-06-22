import type { DocumentRequest } from "@/lib/types";

export function DocumentChecklist({ requests }: { requests: DocumentRequest[] }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <strong>Document request queue</strong>
        <span>June 2026</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Period</th>
              <th>Due date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td><strong>{request.documentName}</strong></td>
                <td>{request.period}</td>
                <td>{request.dueDate}</td>
                <td><span className={`status status-${request.status}`}>{request.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

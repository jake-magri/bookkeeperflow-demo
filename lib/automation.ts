import { clients as sampleClients, documentRequests } from "./sampleData";
import type { Client, DocumentRequest } from "./types";
import { isReadyStatus } from "./demoState";

export function getClientReadiness(clientId: string, requests: DocumentRequest[] = documentRequests) {
  const clientDocs = requests.filter((request) => request.clientId === clientId);
  const submitted = clientDocs.filter((request) => request.status === "submitted");
  const verified = clientDocs.filter((request) => isReadyStatus(request.status));
  const missing = clientDocs.filter(
    (request) => request.status === "missing" || request.status === "overdue" || request.status === "rejected"
  );

  return {
    total: clientDocs.length,
    submitted: submitted.length,
    verified: verified.length,
    missing: missing.length,
    isReady: clientDocs.length > 0 && missing.length === 0 && submitted.length === 0
  };
}

export function buildReminderEmail(
  clientId: string,
  requests: DocumentRequest[] = documentRequests,
  clientList: Client[] = sampleClients
) {
  const client = clientList.find((record) => record.id === clientId);
  const missingDocs = requests.filter(
    (request) =>
      request.clientId === clientId &&
      (request.status === "missing" || request.status === "overdue" || request.status === "rejected")
  );

  if (!client) return "Client not found.";

  if (missingDocs.length === 0) {
    return `Hi ${client.contactName},\n\nThanks for sending everything over. We have the documents we need for this period and will follow up if anything else comes up.\n\nBest,\nYour bookkeeping team`;
  }

  const list = missingDocs.map((doc) => `- ${doc.documentName}`).join("\n");

  return `Hi ${client.contactName},\n\nQuick reminder that we are still missing the following documents for ${missingDocs[0]?.period ?? "this month"}:\n\n${list}\n\nPlease upload them to your shared client folder, then mark each item as submitted in the request portal so our tracker stays current.\n\nThank you,\nYour bookkeeping team`;
}

export function getDashboardMetrics(
  requests: DocumentRequest[] = documentRequests,
  clientList: Client[] = sampleClients
) {
  const ready = clientList.filter((client) => getClientReadiness(client.id, requests).isReady).length;
  const missing = requests.filter((request) => request.status === "missing" || request.status === "rejected").length;
  const overdue = requests.filter((request) => request.status === "overdue").length;
  const submitted = requests.filter((request) => request.status === "submitted").length;

  return {
    clients: clientList.length,
    ready,
    submitted,
    missing,
    overdue
  };
}

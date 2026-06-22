"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildReminderEmail, getClientReadiness, getDashboardMetrics } from "@/lib/automation";
import {
  ACCOUNT_SETTINGS_STORAGE_KEY,
  CLIENTS_STORAGE_KEY,
  DOCUMENT_TYPES_STORAGE_KEY,
  EVENTS_STORAGE_KEY,
  MONTHLY_REQUESTS_STORAGE_KEY,
  REQUEST_STORAGE_KEY,
  getClientFolderPath,
  getClientPortalUrl,
  getDefaultAccountSettings,
  getDefaultAutomationEvents,
  getDefaultClients,
  getDefaultDocumentTypes,
  getDefaultDocumentRequests,
  getDefaultMonthlyRequests,
  getExternalFolderLabel,
  getStatusLabel,
  getSuggestedFileName,
  isReadyStatus,
  loadJsonFromStorage,
  saveJsonToStorage,
  slugify
} from "@/lib/demoState";
import type { AccountSettings, AutomationEvent, Client, DocumentRequest, MonthlyRequest } from "@/lib/types";
import { StatCard } from "./StatCard";

function nowIso() {
  return new Date().toISOString();
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function uniqueDocumentTypes(requests: DocumentRequest[], configuredDocumentTypes: string[]) {
  return Array.from(new Set([...configuredDocumentTypes, ...requests.map((request) => request.documentName)])).sort((a, b) =>
    a.localeCompare(b)
  );
}

export function DashboardWorkflowDemo() {
  const [clients, setClients] = useState<Client[]>(getDefaultClients);
  const [documentTypes, setDocumentTypes] = useState<string[]>(getDefaultDocumentTypes);
  const [requests, setRequests] = useState<DocumentRequest[]>(getDefaultDocumentRequests);
  const [monthlyRequestList, setMonthlyRequestList] = useState<MonthlyRequest[]>(getDefaultMonthlyRequests);
  const [events, setEvents] = useState<AutomationEvent[]>(getDefaultAutomationEvents);
  const [settings, setSettings] = useState<AccountSettings>(getDefaultAccountSettings);
  const [selectedClientId, setSelectedClientId] = useState("c-001");
  const [reviewClientId, setReviewClientId] = useState("c-001");
  const [period, setPeriod] = useState(getDefaultAccountSettings().defaultPeriod);
  const [dueDate, setDueDate] = useState(todayPlus(7));
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(["Bank statement", "Payroll report", "Receipt exports"]);
  const [customDocName, setCustomDocName] = useState("");
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loadedClients = loadJsonFromStorage(CLIENTS_STORAGE_KEY, getDefaultClients());
    const loadedDocumentTypes = loadJsonFromStorage(DOCUMENT_TYPES_STORAGE_KEY, getDefaultDocumentTypes());
    const loadedRequests = loadJsonFromStorage(REQUEST_STORAGE_KEY, getDefaultDocumentRequests());
    const loadedEvents = loadJsonFromStorage(EVENTS_STORAGE_KEY, getDefaultAutomationEvents());
    const loadedMonthlyRequests = loadJsonFromStorage(MONTHLY_REQUESTS_STORAGE_KEY, getDefaultMonthlyRequests());
    const loadedSettings = loadJsonFromStorage(ACCOUNT_SETTINGS_STORAGE_KEY, getDefaultAccountSettings());

    setClients(loadedClients);
    setDocumentTypes(loadedDocumentTypes);
    setRequests(loadedRequests);
    setEvents(loadedEvents);
    setMonthlyRequestList(loadedMonthlyRequests);
    setSettings(loadedSettings);
    setPeriod(loadedSettings.defaultPeriod);
    setOrigin(window.location.origin);
    setHydrated(true);
  }, []);

  function updateRequests(updater: (current: DocumentRequest[]) => DocumentRequest[]) {
    setRequests((current) => {
      const next = updater(current);
      saveJsonToStorage(REQUEST_STORAGE_KEY, next);
      return next;
    });
  }

  function updateMonthlyRequests(updater: (current: MonthlyRequest[]) => MonthlyRequest[]) {
    setMonthlyRequestList((current) => {
      const next = updater(current);
      saveJsonToStorage(MONTHLY_REQUESTS_STORAGE_KEY, next);
      return next;
    });
  }

  function updateEvents(updater: (current: AutomationEvent[]) => AutomationEvent[]) {
    setEvents((current) => {
      const next = updater(current);
      saveJsonToStorage(EVENTS_STORAGE_KEY, next);
      return next;
    });
  }

  function appendEvent(event: Omit<AutomationEvent, "id" | "createdAt">) {
    updateEvents((current) => [
      {
        id: `ev-${Date.now()}`,
        createdAt: nowIso(),
        ...event
      },
      ...current
    ]);
  }

  function setStatus(request: DocumentRequest, status: DocumentRequest["status"]) {
    const timestamp = nowIso();
    updateRequests((current) =>
      current.map((item) => {
        if (item.id !== request.id) return item;
        if (status === "verified") return { ...item, status, verifiedAt: timestamp };
        if (status === "reviewed") return { ...item, status, reviewedAt: timestamp };
        if (status === "rejected") return { ...item, status, rejectedAt: timestamp };
        return { ...item, status };
      })
    );

    const eventType = status === "verified" ? "bookkeeper_verified" : status === "rejected" ? "document_rejected" : "summary_generated";
    appendEvent({
      clientId: request.clientId,
      eventType,
      summary: `${request.documentName} marked ${getStatusLabel(status).toLowerCase()}.`
    });
  }

  function toggleDocument(documentName: string) {
    setSelectedDocuments((current) =>
      current.includes(documentName) ? current.filter((item) => item !== documentName) : [...current, documentName]
    );
  }

  function addCustomDocToSelection() {
    const name = customDocName.trim();
    if (!name) return;
    setSelectedDocuments((current) => (current.includes(name) ? current : [...current, name]));
    setDocumentTypes((current) => {
      const next = current.includes(name) ? current : [...current, name];
      saveJsonToStorage(DOCUMENT_TYPES_STORAGE_KEY, next);
      return next;
    });
    setCustomDocName("");
  }

  function createMonthlyRequest() {
    const client = clients.find((record) => record.id === selectedClientId);
    if (!client || selectedDocuments.length === 0) return;

    const requestId = `mr-${Date.now()}`;
    const secureToken = `${slugify(client.businessName)}-${slugify(period)}-${Date.now().toString(36)}`;
    const externalFolderPath = getClientFolderPath(settings, client, period);
    const newMonthlyRequest: MonthlyRequest = {
      id: requestId,
      clientId: client.id,
      title: `${period} Month-End Documents`,
      period,
      dueDate,
      secureToken,
      externalFolderUrl: settings.googleDriveRootUrl,
      externalFolderLabel: getExternalFolderLabel(settings, client, period),
      externalFolderPath
    };

    const newDocumentRequests: DocumentRequest[] = selectedDocuments.map((documentName, index) => ({
      id: `dr-${Date.now()}-${index}`,
      monthlyRequestId: requestId,
      clientId: client.id,
      period,
      documentName,
      status: "missing",
      dueDate,
      suggestedFileName: getSuggestedFileName(client.businessName, period, documentName)
    }));

    updateMonthlyRequests((current) => [newMonthlyRequest, ...current]);
    updateRequests((current) => [...newDocumentRequests, ...current]);
    appendEvent({
      clientId: client.id,
      eventType: "request_created",
      summary: `Generated ${selectedDocuments.length} requested items for ${client.businessName} in ${externalFolderPath}.`
    });
    setReviewClientId(client.id);
  }

  function resetDemo() {
    const nextClients = getDefaultClients();
    const nextDocumentTypes = getDefaultDocumentTypes();
    const nextRequests = getDefaultDocumentRequests();
    const nextEvents = getDefaultAutomationEvents();
    const nextMonthlyRequests = getDefaultMonthlyRequests();
    const nextSettings = getDefaultAccountSettings();
    setClients(nextClients);
    setDocumentTypes(nextDocumentTypes);
    setRequests(nextRequests);
    setEvents(nextEvents);
    setMonthlyRequestList(nextMonthlyRequests);
    setSettings(nextSettings);
    setSelectedClientId("c-001");
    setReviewClientId("c-001");
    setPeriod(nextSettings.defaultPeriod);
    setDueDate(todayPlus(7));
    saveJsonToStorage(CLIENTS_STORAGE_KEY, nextClients);
    saveJsonToStorage(DOCUMENT_TYPES_STORAGE_KEY, nextDocumentTypes);
    saveJsonToStorage(REQUEST_STORAGE_KEY, nextRequests);
    saveJsonToStorage(EVENTS_STORAGE_KEY, nextEvents);
    saveJsonToStorage(MONTHLY_REQUESTS_STORAGE_KEY, nextMonthlyRequests);
    saveJsonToStorage(ACCOUNT_SETTINGS_STORAGE_KEY, nextSettings);
  }

  async function copyClientLink(monthlyRequest: MonthlyRequest) {
    const clientLink = `${origin}${getClientPortalUrl(monthlyRequest.clientId, monthlyRequest.id)}`;
    try {
      await navigator.clipboard.writeText(clientLink);
      setCopiedLinkId(monthlyRequest.id);
      setTimeout(() => setCopiedLinkId(null), 1600);
    } catch {
      setCopiedLinkId(null);
    }
  }

  const metrics = useMemo(() => getDashboardMetrics(requests, clients), [requests, clients]);
  const availableDocumentTypes = useMemo(() => uniqueDocumentTypes(requests, documentTypes), [requests, documentTypes]);
  const reviewClient = clients.find((client) => client.id === reviewClientId) ?? clients[0]!;
  const reviewRequests = requests.filter((request) => request.clientId === reviewClient?.id);
  const latestReviewRequest = monthlyRequestList.find((request) => request.clientId === reviewClient?.id);
  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0]!;

  return (
    <>
      <section className="container section">
        <div className="section-header split-header">
          <div>
            <span className="eyebrow">Bookkeeper dashboard · V2 workflow demo</span>
            <h2>Generate client requests, name files, and track Drive submissions.</h2>
            <p>
              This version keeps files in the firm&apos;s Google Drive while the app creates the checklist, suggested file names,
              client-specific folders, secure request links, submission status, and bookkeeper verification steps.
            </p>
          </div>
          <div className="actions compact-actions">
            <Link className="btn btn-primary" href={getClientPortalUrl(reviewClient?.id ?? "c-001", latestReviewRequest?.id)}>
              Open selected client link
            </Link>
            <Link className="btn btn-secondary" href="/settings">Account settings</Link>
            <Link className="btn btn-secondary" href="/setup">Setup wizard</Link>
            <button className="btn btn-secondary" type="button" onClick={resetDemo}>Reset demo</button>
          </div>
        </div>
        <div className="grid grid-4">
          <StatCard label="Clients" value={metrics.clients} detail="Active monthly clients" />
          <StatCard label="Ready" value={metrics.ready} detail="Verified or reviewed docs only" />
          <StatCard label="Submitted" value={metrics.submitted} detail="Client says uploaded; needs verification" />
          <StatCard label="Missing" value={metrics.missing + metrics.overdue} detail="Missing, rejected, or overdue" />
        </div>
      </section>

      <section className="container section">
        <div className="grid two-column">
          <div className="panel">
            <div className="panel-header">
              <strong>Google Drive connection</strong>
              <span>{settings.googleDriveConnected ? "Connected" : "Not connected"}</span>
            </div>
            <div className="panel-body stack">
              <p className="muted-copy">
                The V2 demo assumes the firm connects Google Drive in account settings. The app does not store sensitive files; it
                creates a Drive folder plan and tracks whether the client says each item was submitted.
              </p>
              <div className="storage-card">
                <span>{settings.storageProvider}</span>
                <strong>{settings.parentFolderName}</strong>
                <a href={settings.googleDriveRootUrl} target="_blank" rel="noreferrer">Open connected Google Drive ↗</a>
              </div>
              <Link className="small-btn primary-small-btn" href="/settings">Manage storage settings</Link>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <strong>Folder + file naming rule</strong>
              <span>Default convention</span>
            </div>
            <div className="panel-body stack">
              <p className="muted-copy">Each request generates a client folder path and suggested file names.</p>
              <div className="storage-card">
                <span>Folder path</span>
                <strong>{getClientFolderPath(settings, selectedClient, period)}</strong>
              </div>
              <div className="storage-card">
                <span>Suggested file name</span>
                <strong>{getSuggestedFileName(selectedClient.businessName, period, selectedDocuments[0] ?? "Bank statement")}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="panel">
          <div className="panel-header">
            <strong>Create client request</strong>
            <span>Generate a unique request link for any client</span>
          </div>
          <div className="panel-body stack">
            <div className="form-grid request-builder-grid">
              <label>
                Client
                <select value={selectedClientId} onChange={(event) => setSelectedClientId(event.target.value)}>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.businessName}</option>
                  ))}
                </select>
              </label>
              <label>
                Period
                <input value={period} onChange={(event) => setPeriod(event.target.value)} placeholder="June 2026" />
              </label>
              <label>
                Due date
                <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              </label>
            </div>

            <div>
              <strong>Requested items</strong>
              <div className="checkbox-grid">
                {availableDocumentTypes.map((documentName) => (
                  <label className="checkbox-card" key={documentName}>
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(documentName)}
                      onChange={() => toggleDocument(documentName)}
                    />
                    <span>{documentName}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="inline-form">
              <input
                aria-label="Custom requested document"
                placeholder="Add custom requested item, e.g. Sales tax report"
                value={customDocName}
                onChange={(event) => setCustomDocName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addCustomDocToSelection();
                }}
              />
              <button className="btn btn-secondary" type="button" onClick={addCustomDocToSelection}>Add item</button>
              <button className="btn btn-primary" type="button" onClick={createMonthlyRequest}>Generate request link</button>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="panel">
          <div className="panel-header">
            <strong>Generated client links</strong>
            <span>{monthlyRequestList.length} active demo requests</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Request</th>
                  <th>Drive folder path</th>
                  <th>Client portal</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRequestList.map((monthlyRequest) => {
                  const client = clients.find((record) => record.id === monthlyRequest.clientId);
                  const portalUrl = getClientPortalUrl(monthlyRequest.clientId, monthlyRequest.id);
                  return (
                    <tr key={monthlyRequest.id}>
                      <td><strong>{client?.businessName ?? "Unknown client"}</strong></td>
                      <td>{monthlyRequest.title}<br /><span className="muted-copy">Due {monthlyRequest.dueDate}</span></td>
                      <td>{monthlyRequest.externalFolderPath}</td>
                      <td>
                        <div className="row-actions">
                          <Link className="small-btn primary-small-btn" href={portalUrl}>Open link</Link>
                          <button className="small-btn" type="button" onClick={() => copyClientLink(monthlyRequest)}>
                            {copiedLinkId === monthlyRequest.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container section">
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
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  const readiness = getClientReadiness(client.id, requests);
                  const computedStatus = readiness.isReady ? "ready" : readiness.missing > 0 ? client.status : "waiting";
                  return (
                    <tr key={client.id}>
                      <td><strong>{client.businessName}</strong></td>
                      <td>{client.contactName}<br /><span className="muted-copy">{client.email}</span></td>
                      <td>{client.assignedBookkeeper}</td>
                      <td>{readiness.verified}/{readiness.total || "—"} verified · {readiness.submitted} submitted</td>
                      <td><span className={`status status-${computedStatus}`}>{computedStatus}</span></td>
                      <td><button className="small-btn" type="button" onClick={() => setReviewClientId(client.id)}>Select</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "1.2rem" }}>
          <div className="panel">
            <div className="panel-header">
              <strong>Document verification queue · {reviewClient?.businessName}</strong>
              <span>{reviewRequests.length} requested items</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Suggested name</th>
                    <th>Status</th>
                    <th>Client note</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewRequests.map((request) => (
                    <tr key={request.id}>
                      <td><strong>{request.documentName}</strong><br /><span className="muted-copy">{request.period}</span></td>
                      <td>{request.externalFileName ?? request.suggestedFileName ?? getSuggestedFileName(reviewClient?.businessName ?? "Client", request.period, request.documentName)}</td>
                      <td><span className={`status status-${request.status}`}>{getStatusLabel(request.status)}</span></td>
                      <td>{request.clientNote ?? "—"}</td>
                      <td>{formatDateTime(request.reviewedAt ?? request.verifiedAt ?? request.submittedAt ?? request.rejectedAt)}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="small-btn"
                            type="button"
                            disabled={request.status !== "submitted"}
                            onClick={() => setStatus(request, "verified")}
                          >
                            Verify
                          </button>
                          <button
                            className="small-btn primary-small-btn"
                            type="button"
                            disabled={!isReadyStatus(request.status)}
                            onClick={() => setStatus(request, "reviewed")}
                          >
                            Review
                          </button>
                          <button
                            className="small-btn danger-btn"
                            type="button"
                            disabled={request.status === "missing" || request.status === "overdue"}
                            onClick={() => setStatus(request, "rejected")}
                          >
                            Request again
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <strong>AI-assisted follow-up draft</strong>
              <span>Human review before sending</span>
            </div>
            <div className="panel-body">
              <textarea readOnly value={buildReminderEmail(reviewClient?.id ?? "c-001", requests, clients)} />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <strong>Workflow event log</strong>
              <span>{hydrated ? "Live browser demo state" : "Loading demo state"}</span>
            </div>
            <div className="panel-body timeline">
              {events.slice(0, 8).map((event) => (
                <div className="timeline-item" key={event.id}>
                  <span className="timeline-dot" />
                  <div>
                    <strong>{event.eventType.replaceAll("_", " ")}</strong>
                    <p>{event.summary}</p>
                    <p>{formatDateTime(event.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

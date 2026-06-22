"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ACCOUNT_SETTINGS_STORAGE_KEY,
  CLIENTS_STORAGE_KEY,
  EVENTS_STORAGE_KEY,
  MONTHLY_REQUESTS_STORAGE_KEY,
  REQUEST_STORAGE_KEY,
  getClientPortalUrl,
  getDefaultAccountSettings,
  getDefaultAutomationEvents,
  getDefaultClients,
  getDefaultDocumentRequests,
  getDefaultMonthlyRequests,
  getStatusLabel,
  getSuggestedFileName,
  loadJsonFromStorage,
  saveJsonToStorage
} from "@/lib/demoState";
import type { AccountSettings, AutomationEvent, Client, DocumentRequest, MonthlyRequest } from "@/lib/types";

function getQueryParam(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export function ClientSubmissionDemo() {
  const [clients, setClients] = useState<Client[]>(getDefaultClients);
  const [requests, setRequests] = useState<DocumentRequest[]>(getDefaultDocumentRequests);
  const [monthlyRequestList, setMonthlyRequestList] = useState<MonthlyRequest[]>(getDefaultMonthlyRequests);
  const [settings, setSettings] = useState<AccountSettings>(getDefaultAccountSettings);
  const [clientId, setClientId] = useState("c-001");
  const [monthlyRequestId, setMonthlyRequestId] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadedClients = loadJsonFromStorage(CLIENTS_STORAGE_KEY, getDefaultClients());
    const loadedRequests = loadJsonFromStorage(REQUEST_STORAGE_KEY, getDefaultDocumentRequests());
    const loadedMonthlyRequests = loadJsonFromStorage(MONTHLY_REQUESTS_STORAGE_KEY, getDefaultMonthlyRequests());
    const loadedSettings = loadJsonFromStorage(ACCOUNT_SETTINGS_STORAGE_KEY, getDefaultAccountSettings());
    const queryClientId = getQueryParam("clientId");
    const queryRequestId = getQueryParam("requestId");

    setClients(loadedClients);
    setRequests(loadedRequests);
    setMonthlyRequestList(loadedMonthlyRequests);
    setSettings(loadedSettings);

    if (queryClientId && loadedClients.some((client) => client.id === queryClientId)) {
      setClientId(queryClientId);
    }

    if (queryRequestId) {
      setMonthlyRequestId(queryRequestId);
    }
  }, []);

  const client = clients.find((record) => record.id === clientId) ?? clients[0]!;
  const clientMonthlyRequests = monthlyRequestList.filter((request) => request.clientId === client.id);
  const currentMonthlyRequest =
    clientMonthlyRequests.find((request) => request.id === monthlyRequestId) ?? clientMonthlyRequests[0] ?? null;
  const clientRequests = useMemo(() => {
    if (!currentMonthlyRequest) return [];
    return requests.filter((request) => request.clientId === client.id && request.monthlyRequestId === currentMonthlyRequest.id);
  }, [client.id, currentMonthlyRequest, requests]);
  const submittedCount = clientRequests.filter((request) => request.status !== "missing" && request.status !== "overdue").length;

  function markSubmitted(request: DocumentRequest) {
    const suggestedFileName = request.suggestedFileName ?? getSuggestedFileName(client.businessName, request.period, request.documentName);
    const externalFileName = fileNames[request.id]?.trim() || request.externalFileName || suggestedFileName;
    const clientNote = notes[request.id]?.trim() || request.clientNote || "Client marked this item as uploaded to the shared Google Drive folder.";
    const submittedAt = new Date().toISOString();

    const nextRequests = requests.map((item) =>
      item.id === request.id
        ? {
            ...item,
            status: "submitted" as const,
            submittedAt,
            externalFileName,
            suggestedFileName,
            clientNote,
            verifiedAt: undefined,
            reviewedAt: undefined,
            rejectedAt: undefined
          }
        : item
    );

    setRequests(nextRequests);
    saveJsonToStorage(REQUEST_STORAGE_KEY, nextRequests);

    const currentEvents = loadJsonFromStorage(EVENTS_STORAGE_KEY, getDefaultAutomationEvents());
    const nextEvents: AutomationEvent[] = [
      {
        id: `ev-${Date.now()}`,
        clientId: request.clientId,
        eventType: "submission_marked",
        summary: `${request.documentName} marked submitted by ${client.contactName}. Saved as ${externalFileName}.`,
        createdAt: submittedAt
      },
      ...currentEvents
    ];
    saveJsonToStorage(EVENTS_STORAGE_KEY, nextEvents);

    setFileNames((current) => ({ ...current, [request.id]: "" }));
    setNotes((current) => ({ ...current, [request.id]: "" }));
  }

  return (
    <>
      <section className="container hero client-hero">
        <div>
          <span className="eyebrow">Secure client request link</span>
          <h1>{currentMonthlyRequest?.title ?? "No request selected"}</h1>
          <p>
            {client.contactName}, upload your documents to the shared Google Drive folder, name them using the suggested file names,
            then mark each checklist item as submitted. Your bookkeeping team will verify the files before month-end close.
          </p>
          <div className="actions">
            <a className="btn btn-primary" href={currentMonthlyRequest?.externalFolderUrl ?? settings.googleDriveRootUrl} target="_blank" rel="noreferrer">
              Open Google Drive folder
            </a>
            <Link className="btn btn-secondary" href="/dashboard">Back to bookkeeper dashboard</Link>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <strong>{client.businessName}</strong>
            <span>Due {currentMonthlyRequest?.dueDate ?? "—"}</span>
          </div>
          <div className="panel-body grid">
            <article className="card">
              <p>Checklist progress</p>
              <div className="metric">{submittedCount}/{clientRequests.length}</div>
              <p>Items submitted or already accepted by the bookkeeper.</p>
            </article>
            <article className="card">
              <p>Storage location</p>
              <h3>{currentMonthlyRequest?.externalFolderPath ?? settings.parentFolderName}</h3>
              <p>Files remain in the firm-controlled Google Drive folder.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="panel">
          <div className="panel-header">
            <strong>Switch demo client</strong>
            <span>Simulates unique links per client</span>
          </div>
          <div className="panel-body form-grid request-builder-grid">
            <label>
              Client
              <select
                value={client.id}
                onChange={(event) => {
                  const nextClientId = event.target.value;
                  const nextRequest = monthlyRequestList.find((request) => request.clientId === nextClientId);
                  setClientId(nextClientId);
                  setMonthlyRequestId(nextRequest?.id ?? null);
                  window.history.replaceState(null, "", getClientPortalUrl(nextClientId, nextRequest?.id));
                }}
              >
                {clients.map((record) => (
                  <option key={record.id} value={record.id}>{record.businessName}</option>
                ))}
              </select>
            </label>
            <label>
              Request
              <select
                value={currentMonthlyRequest?.id ?? ""}
                onChange={(event) => {
                  const nextRequestId = event.target.value;
                  setMonthlyRequestId(nextRequestId);
                  window.history.replaceState(null, "", getClientPortalUrl(client.id, nextRequestId));
                }}
              >
                {clientMonthlyRequests.map((request) => (
                  <option key={request.id} value={request.id}>{request.title}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="panel">
          <div className="panel-header">
            <strong>Requested documents</strong>
            <span>Client self-submits · bookkeeper verifies</span>
          </div>
          <div className="panel-body stack">
            <p className="muted-copy">
              The app tracks the checklist and suggested naming convention. The files stay in Google Drive. A client-submitted status
              means the client says they uploaded it; the bookkeeper still verifies the file exists.
            </p>
            {clientRequests.length === 0 ? (
              <div className="empty-state">
                <strong>No requested items yet.</strong>
                <p>Generate a request for this client from the dashboard first.</p>
              </div>
            ) : (
              <div className="request-list">
                {clientRequests.map((request) => {
                  const isLocked = request.status === "verified" || request.status === "reviewed";
                  const suggestedFileName = request.suggestedFileName ?? getSuggestedFileName(client.businessName, request.period, request.documentName);
                  return (
                    <article className="request-item" key={request.id}>
                      <div className="request-item-header">
                        <div>
                          <h3>{request.documentName}</h3>
                          <p>Due {request.dueDate}</p>
                        </div>
                        <span className={`status status-${request.status}`}>{getStatusLabel(request.status)}</span>
                      </div>

                      <div className="submission-summary suggested-name-card">
                        <strong>Suggested file name:</strong> {suggestedFileName}
                        <p>Folder: {currentMonthlyRequest?.externalFolderPath}</p>
                      </div>

                      {request.externalFileName ? (
                        <div className="submission-summary">
                          <strong>Current submitted name:</strong> {request.externalFileName}
                          {request.clientNote ? <p>{request.clientNote}</p> : null}
                        </div>
                      ) : null}

                      <div className="client-form-grid">
                        <label>
                          File name used in Google Drive
                          <input
                            disabled={isLocked}
                            placeholder={suggestedFileName}
                            value={fileNames[request.id] ?? ""}
                            onChange={(event) => setFileNames((current) => ({ ...current, [request.id]: event.target.value }))}
                          />
                        </label>
                        <label>
                          Optional note
                          <input
                            disabled={isLocked}
                            placeholder="Uploaded to the client folder"
                            value={notes[request.id] ?? ""}
                            onChange={(event) => setNotes((current) => ({ ...current, [request.id]: event.target.value }))}
                          />
                        </label>
                      </div>

                      <div className="row-actions">
                        <a className="small-btn" href={currentMonthlyRequest?.externalFolderUrl ?? settings.googleDriveRootUrl} target="_blank" rel="noreferrer">
                          Open Google Drive
                        </a>
                        <button
                          className="small-btn primary-small-btn"
                          type="button"
                          disabled={isLocked}
                          onClick={() => markSubmitted(request)}
                        >
                          Mark as submitted
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  getExternalFolderLabel,
  getSuggestedFileName,
  loadJsonFromStorage,
  saveJsonToStorage,
  slugify
} from "@/lib/demoState";
import type { AccountSettings, AutomationEvent, Client, DocumentRequest, MonthlyRequest } from "@/lib/types";

const DEFAULT_CLIENT_TEXT = `Queen City Dental Studio | Maya Carter | maya@example.com | Nina
South End Fitness LLC | Drew Howard | drew@example.com | Nina
Lake Wylie Property Services | Andre Bell | andre@example.com | Sam`;

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function clientLine(client: Client) {
  return `${client.businessName} | ${client.contactName} | ${client.email} | ${client.assignedBookkeeper}`;
}

function parseClientLines(value: string): Client[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [businessNameRaw, contactNameRaw, emailRaw, bookkeeperRaw] = line.split("|").map((part) => part?.trim());
      const businessName = businessNameRaw || `Client ${index + 1}`;
      return {
        id: `c-${String(index + 1).padStart(3, "0")}`,
        businessName,
        contactName: contactNameRaw || "Client Contact",
        email: emailRaw || `client${index + 1}@example.com`,
        assignedBookkeeper: bookkeeperRaw || "Bookkeeper",
        status: "new" as const
      };
    });
}

function parseDocumentTypes(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    )
  );
}

function buildMonthlyRequest(settings: AccountSettings, client: Client, period: string, dueDate: string, index: number): MonthlyRequest {
  const timestamp = Date.now().toString(36);
  const requestId = `mr-${timestamp}-${index}`;
  const externalFolderPath = getClientFolderPath(settings, client, period);

  return {
    id: requestId,
    clientId: client.id,
    title: `${period} Month-End Documents`,
    period,
    dueDate,
    secureToken: `${slugify(client.businessName)}-${slugify(period)}-${timestamp}-${index}`,
    externalFolderUrl: settings.googleDriveRootUrl,
    externalFolderLabel: getExternalFolderLabel(settings, client, period),
    externalFolderPath
  };
}

function buildDocumentRequests(monthlyRequest: MonthlyRequest, client: Client, documentTypes: string[]): DocumentRequest[] {
  return documentTypes.map((documentName, index) => ({
    id: `dr-${monthlyRequest.id}-${index}`,
    monthlyRequestId: monthlyRequest.id,
    clientId: client.id,
    period: monthlyRequest.period,
    documentName,
    status: "missing" as const,
    dueDate: monthlyRequest.dueDate,
    suggestedFileName: getSuggestedFileName(client.businessName, monthlyRequest.period, documentName)
  }));
}

export function SetupWizard() {
  const [settings, setSettings] = useState<AccountSettings>(getDefaultAccountSettings);
  const [period, setPeriod] = useState(getDefaultAccountSettings().defaultPeriod);
  const [dueDate, setDueDate] = useState(todayPlus(7));
  const [clientText, setClientText] = useState(DEFAULT_CLIENT_TEXT);
  const [documentTypeText, setDocumentTypeText] = useState(getDefaultDocumentTypes().join("\n"));
  const [savedMessage, setSavedMessage] = useState("");
  const [origin, setOrigin] = useState("");
  const [importText, setImportText] = useState("");

  useEffect(() => {
    const loadedSettings = loadJsonFromStorage(ACCOUNT_SETTINGS_STORAGE_KEY, getDefaultAccountSettings());
    const loadedClients = loadJsonFromStorage(CLIENTS_STORAGE_KEY, getDefaultClients());
    const loadedDocumentTypes = loadJsonFromStorage(DOCUMENT_TYPES_STORAGE_KEY, getDefaultDocumentTypes());

    setSettings(loadedSettings);
    setPeriod(loadedSettings.defaultPeriod);
    setClientText(loadedClients.map(clientLine).join("\n"));
    setDocumentTypeText(loadedDocumentTypes.join("\n"));
    setOrigin(window.location.origin);
  }, []);

  const parsedClients = useMemo(() => parseClientLines(clientText), [clientText]);
  const parsedDocumentTypes = useMemo(() => parseDocumentTypes(documentTypeText), [documentTypeText]);

  function applyPilotSetup() {
    const nextSettings = { ...settings, defaultPeriod: period, googleDriveConnected: Boolean(settings.googleDriveRootUrl) };
    const monthlyRequests = parsedClients.map((client, index) => buildMonthlyRequest(nextSettings, client, period, dueDate, index));
    const documentRequests = monthlyRequests.flatMap((monthlyRequest) => {
      const client = parsedClients.find((record) => record.id === monthlyRequest.clientId)!;
      return buildDocumentRequests(monthlyRequest, client, parsedDocumentTypes);
    });
    const events: AutomationEvent[] = [
      {
        id: `ev-${Date.now()}`,
        clientId: parsedClients[0]?.id ?? "c-001",
        eventType: "request_created",
        summary: `Pilot setup generated ${monthlyRequests.length} client links and ${documentRequests.length} requested items for ${period}.`,
        createdAt: new Date().toISOString()
      },
      ...getDefaultAutomationEvents()
    ];

    saveJsonToStorage(ACCOUNT_SETTINGS_STORAGE_KEY, nextSettings);
    saveJsonToStorage(CLIENTS_STORAGE_KEY, parsedClients);
    saveJsonToStorage(DOCUMENT_TYPES_STORAGE_KEY, parsedDocumentTypes);
    saveJsonToStorage(MONTHLY_REQUESTS_STORAGE_KEY, monthlyRequests);
    saveJsonToStorage(REQUEST_STORAGE_KEY, documentRequests);
    saveJsonToStorage(EVENTS_STORAGE_KEY, events);
    setSavedMessage(`Saved pilot setup for ${parsedClients.length} clients.`);
    setTimeout(() => setSavedMessage(""), 2200);
  }

  function restoreDefaults() {
    const defaults = getDefaultAccountSettings();
    setSettings(defaults);
    setPeriod(defaults.defaultPeriod);
    setDueDate(todayPlus(7));
    setClientText(getDefaultClients().map(clientLine).join("\n"));
    setDocumentTypeText(getDefaultDocumentTypes().join("\n"));
    setSavedMessage("Restored default setup values. Click Apply to write them to the demo.");
  }

  function exportConfig() {
    const payload = {
      settings: { ...settings, defaultPeriod: period },
      dueDate,
      clients: parsedClients,
      documentTypes: parsedDocumentTypes
    };
    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    setSavedMessage("Copied setup package JSON to clipboard.");
    setTimeout(() => setSavedMessage(""), 2200);
  }

  function importConfig() {
    try {
      const parsed = JSON.parse(importText) as {
        settings?: AccountSettings;
        dueDate?: string;
        clients?: Client[];
        documentTypes?: string[];
      };
      if (parsed.settings) {
        setSettings({ ...getDefaultAccountSettings(), ...parsed.settings });
        setPeriod(parsed.settings.defaultPeriod || period);
      }
      if (parsed.dueDate) setDueDate(parsed.dueDate);
      if (parsed.clients?.length) setClientText(parsed.clients.map(clientLine).join("\n"));
      if (parsed.documentTypes?.length) setDocumentTypeText(parsed.documentTypes.join("\n"));
      setSavedMessage("Imported setup package. Review, then click Apply pilot setup.");
    } catch {
      setSavedMessage("Could not import JSON. Check formatting and try again.");
    }
  }

  return (
    <>
      <section className="container hero settings-hero">
        <div>
          <span className="eyebrow">Bootcamp path · productized service setup</span>
          <h1>Configure a client-ready demo in one pass.</h1>
          <p>
            Use this setup wizard when a bookkeeping firm gives you their firm name, Drive folder, pilot clients, and standard
            month-end document list. It writes everything to the demo state so you can avoid hand-editing code for each prospect.
          </p>
          <div className="actions">
            <button className="btn btn-primary" type="button" onClick={applyPilotSetup}>Apply pilot setup</button>
            <Link className="btn btn-secondary" href="/dashboard">Open dashboard</Link>
            <button className="btn btn-secondary" type="button" onClick={restoreDefaults}>Restore defaults</button>
          </div>
          {savedMessage ? <p className="success-note">{savedMessage}</p> : null}
        </div>
        <div className="panel">
          <div className="panel-header">
            <strong>Setup estimate</strong>
            <span>Implementation scope guard</span>
          </div>
          <div className="panel-body grid">
            <article className="card">
              <p>Pilot clients</p>
              <div className="metric">{parsedClients.length}</div>
              <p>Included in this setup package.</p>
            </article>
            <article className="card">
              <p>Document types</p>
              <div className="metric">{parsedDocumentTypes.length}</div>
              <p>Reusable request checklist items.</p>
            </article>
            <article className="card">
              <p>Generated links</p>
              <div className="metric">{parsedClients.length}</div>
              <p>One client portal link per pilot client.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="panel">
          <div className="panel-header">
            <strong>Firm and storage setup</strong>
            <span>No database required for demo configuration</span>
          </div>
          <div className="panel-body stack">
            <div className="form-grid settings-form-grid">
              <label>
                Firm name
                <input value={settings.firmName} onChange={(event) => setSettings((current) => ({ ...current, firmName: event.target.value }))} />
              </label>
              <label>
                Google Drive or SharePoint root link
                <input value={settings.googleDriveRootUrl} onChange={(event) => setSettings((current) => ({ ...current, googleDriveRootUrl: event.target.value }))} />
              </label>
              <label>
                Parent folder name
                <input value={settings.parentFolderName} onChange={(event) => setSettings((current) => ({ ...current, parentFolderName: event.target.value }))} />
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
            <div className="storage-card">
              <span>Folder path pattern</span>
              <strong>{settings.parentFolderName} / {period || "Period"} / Client Business Name</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="grid grid-2 setup-grid">
          <div className="panel">
            <div className="panel-header">
              <strong>Pilot clients</strong>
              <span>Business | Contact | Email | Bookkeeper</span>
            </div>
            <div className="panel-body stack">
              <textarea
                className="setup-textarea"
                value={clientText}
                onChange={(event) => setClientText(event.target.value)}
                spellCheck={false}
              />
              <p className="muted-copy">Paste one client per line. This creates IDs, client portal links, and request folders automatically.</p>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <strong>Standard document types</strong>
              <span>One per line</span>
            </div>
            <div className="panel-body stack">
              <textarea
                className="setup-textarea"
                value={documentTypeText}
                onChange={(event) => setDocumentTypeText(event.target.value)}
                spellCheck={false}
              />
              <p className="muted-copy">Keep this list boring. The goal is fast month-end collection, not accounting judgment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="panel">
          <div className="panel-header">
            <strong>Generated client links preview</strong>
            <span>{origin ? "Ready to copy after applying setup" : "Loading origin"}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Folder path</th>
                  <th>Client portal URL</th>
                </tr>
              </thead>
              <tbody>
                {parsedClients.map((client, index) => {
                  const monthlyRequest = buildMonthlyRequest({ ...settings, defaultPeriod: period }, client, period, dueDate, index);
                  return (
                    <tr key={client.id}>
                      <td><strong>{client.businessName}</strong><br /><span className="muted-copy">{client.contactName} · {client.email}</span></td>
                      <td>{monthlyRequest.externalFolderPath}</td>
                      <td><code>{origin}{getClientPortalUrl(client.id, monthlyRequest.id)}</code></td>
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
            <strong>Reusable setup package</strong>
            <span>Copy between prospects or machines</span>
          </div>
          <div className="panel-body stack">
            <p className="muted-copy">
              Use export/import when you run a paid audit. It lets you save a firm&apos;s setup inputs without adding a database or creating
              a separate account for every client during the demo phase.
            </p>
            <div className="actions compact-actions">
              <button className="btn btn-secondary" type="button" onClick={exportConfig}>Copy setup JSON</button>
              <button className="btn btn-primary" type="button" onClick={importConfig}>Import setup JSON</button>
            </div>
            <textarea
              className="setup-textarea small-setup-textarea"
              placeholder="Paste exported setup JSON here, then click Import setup JSON."
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      </section>
    </>
  );
}

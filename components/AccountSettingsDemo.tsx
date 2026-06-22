"use client";

import { useEffect, useState } from "react";
import {
  ACCOUNT_SETTINGS_STORAGE_KEY,
  EVENTS_STORAGE_KEY,
  getDefaultAccountSettings,
  getDefaultAutomationEvents,
  loadJsonFromStorage,
  saveJsonToStorage
} from "@/lib/demoState";
import type { AccountSettings, AutomationEvent } from "@/lib/types";

export function AccountSettingsDemo() {
  const [settings, setSettings] = useState<AccountSettings>(getDefaultAccountSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadJsonFromStorage(ACCOUNT_SETTINGS_STORAGE_KEY, getDefaultAccountSettings()));
  }, []);

  function saveSettings(nextSettings: AccountSettings) {
    setSettings(nextSettings);
    saveJsonToStorage(ACCOUNT_SETTINGS_STORAGE_KEY, nextSettings);
    const currentEvents = loadJsonFromStorage(EVENTS_STORAGE_KEY, getDefaultAutomationEvents());
    const nextEvents: AutomationEvent[] = [
      {
        id: `ev-${Date.now()}`,
        clientId: "c-001",
        eventType: "storage_connected",
        summary: `${nextSettings.storageProvider} connection saved for ${nextSettings.firmName}.`,
        createdAt: new Date().toISOString()
      },
      ...currentEvents
    ];
    saveJsonToStorage(EVENTS_STORAGE_KEY, nextEvents);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  function connectGoogleDrive() {
    saveSettings({
      ...settings,
      storageProvider: "Google Drive",
      googleDriveConnected: true,
      googleDriveRootUrl: settings.googleDriveRootUrl || "https://drive.google.com/drive/my-drive"
    });
  }

  return (
    <>
      <section className="container hero settings-hero">
        <div>
          <span className="eyebrow">Account settings · storage connection</span>
          <h1>Connect the firm&apos;s Google Drive.</h1>
          <p>
            This demo keeps sensitive financial documents in the bookkeeper&apos;s own storage. The app tracks the request, naming
            convention, folder path, submission status, and verification workflow.
          </p>
          <div className="actions">
            <button className="btn btn-primary" type="button" onClick={connectGoogleDrive}>
              {settings.googleDriveConnected ? "Reconnect Google Drive" : "Connect Google Drive"}
            </button>
            <a className="btn btn-secondary" href={settings.googleDriveRootUrl} target="_blank" rel="noreferrer">
              Open current Drive link
            </a>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <strong>Connection status</strong>
            <span>{settings.googleDriveConnected ? "Connected" : "Not connected"}</span>
          </div>
          <div className="panel-body grid">
            <article className="card">
              <p>Storage provider</p>
              <h3>{settings.storageProvider}</h3>
              <p>Files stay outside the app in the firm-controlled drive.</p>
            </article>
            <article className="card">
              <p>Parent folder</p>
              <h3>{settings.parentFolderName}</h3>
              <p>Client folders are nested inside this parent folder.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="panel">
          <div className="panel-header">
            <strong>Storage settings</strong>
            <span>{saved ? "Saved" : "Demo OAuth placeholder"}</span>
          </div>
          <div className="panel-body stack">
            <p className="muted-copy">
              V1 uses a saved Google Drive root link so generated client folder links do not go to a fake 404 page. A production
              version would replace this with Google OAuth, folder creation, and scoped Drive permissions.
            </p>
            <div className="form-grid settings-form-grid">
              <label>
                Firm name
                <input
                  value={settings.firmName}
                  onChange={(event) => setSettings((current) => ({ ...current, firmName: event.target.value }))}
                />
              </label>
              <label>
                Google Drive root link
                <input
                  value={settings.googleDriveRootUrl}
                  onChange={(event) => setSettings((current) => ({ ...current, googleDriveRootUrl: event.target.value }))}
                />
              </label>
              <label>
                Parent folder name
                <input
                  value={settings.parentFolderName}
                  onChange={(event) => setSettings((current) => ({ ...current, parentFolderName: event.target.value }))}
                />
              </label>
              <label>
                Default period
                <input
                  value={settings.defaultPeriod}
                  onChange={(event) => setSettings((current) => ({ ...current, defaultPeriod: event.target.value }))}
                />
              </label>
            </div>
            <div className="storage-card">
              <span>Generated folder path pattern</span>
              <strong>{settings.parentFolderName} / {settings.defaultPeriod} / Client Business Name</strong>
            </div>
            <div className="actions compact-actions">
              <button className="btn btn-primary" type="button" onClick={() => saveSettings({ ...settings, googleDriveConnected: true })}>
                Save settings
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => saveSettings(getDefaultAccountSettings())}>
                Restore demo defaults
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

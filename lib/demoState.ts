import type { AccountSettings, AutomationEvent, Client, DocumentRequest, MonthlyRequest } from "./types";
import { automationEvents, clients, defaultAccountSettings, defaultDocumentTypeNames, documentRequests, monthlyRequests } from "./sampleData";

export const REQUEST_STORAGE_KEY = "bookkeeperflow.demo.documentRequests.v4";
export const EVENTS_STORAGE_KEY = "bookkeeperflow.demo.automationEvents.v4";
export const MONTHLY_REQUESTS_STORAGE_KEY = "bookkeeperflow.demo.monthlyRequests.v4";
export const ACCOUNT_SETTINGS_STORAGE_KEY = "bookkeeperflow.demo.accountSettings.v4";
export const CLIENTS_STORAGE_KEY = "bookkeeperflow.demo.clients.v4";
export const DOCUMENT_TYPES_STORAGE_KEY = "bookkeeperflow.demo.documentTypes.v4";

export function getDefaultClients(): Client[] {
  return clients.map((client) => ({ ...client }));
}

export function getDefaultDocumentTypes(): string[] {
  return [...defaultDocumentTypeNames];
}

export function getDefaultDocumentRequests(): DocumentRequest[] {
  return documentRequests.map((request) => ({ ...request }));
}

export function getDefaultMonthlyRequests(): MonthlyRequest[] {
  return monthlyRequests.map((request) => ({ ...request }));
}

export function getDefaultAutomationEvents(): AutomationEvent[] {
  return automationEvents.map((event) => ({ ...event }));
}

export function getDefaultAccountSettings(): AccountSettings {
  return { ...defaultAccountSettings };
}

export function getStatusLabel(status: DocumentRequest["status"]) {
  switch (status) {
    case "submitted":
      return "Submitted by client";
    case "verified":
      return "Verified by bookkeeper";
    case "reviewed":
      return "Reviewed / accepted";
    case "rejected":
      return "Needs replacement";
    case "overdue":
      return "Overdue";
    default:
      return "Missing";
  }
}

export function isReadyStatus(status: DocumentRequest["status"]) {
  return status === "verified" || status === "reviewed";
}

export function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "request";
}

export function getSuggestedFileName(clientBusinessName: string, period: string, documentName: string) {
  return `${clientBusinessName} - ${period} - ${titleCase(documentName)}.pdf`;
}

export function getClientFolderPath(settings: AccountSettings, client: Client, period: string) {
  return `${settings.parentFolderName} / ${period} / ${client.businessName}`;
}

export function getExternalFolderLabel(settings: AccountSettings, client: Client, period: string) {
  return `${settings.storageProvider} · ${getClientFolderPath(settings, client, period)}`;
}

export function getClientPortalUrl(clientId: string, monthlyRequestId?: string) {
  const params = new URLSearchParams({ clientId });
  if (monthlyRequestId) params.set("requestId", monthlyRequestId);
  return `/client-portal?${params.toString()}`;
}

export function loadJsonFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function saveJsonToStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export type ClientStatus = "ready" | "waiting" | "overdue" | "new";

export type Client = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  assignedBookkeeper: string;
  status: ClientStatus;
  lastReminderAt?: string;
};

export type DocumentStatus = "missing" | "submitted" | "verified" | "reviewed" | "rejected" | "overdue";

export type DocumentRequest = {
  id: string;
  monthlyRequestId: string;
  clientId: string;
  period: string;
  documentName: string;
  status: DocumentStatus;
  dueDate: string;
  submittedAt?: string;
  verifiedAt?: string;
  reviewedAt?: string;
  rejectedAt?: string;
  clientNote?: string;
  externalFileName?: string;
  suggestedFileName?: string;
};

export type MonthlyRequest = {
  id: string;
  clientId: string;
  title: string;
  period: string;
  dueDate: string;
  secureToken: string;
  externalFolderUrl: string;
  externalFolderLabel: string;
  externalFolderPath: string;
};

export type AccountSettings = {
  firmName: string;
  storageProvider: "Google Drive" | "SharePoint";
  googleDriveConnected: boolean;
  googleDriveRootUrl: string;
  parentFolderName: string;
  defaultPeriod: string;
};

export type AutomationEvent = {
  id: string;
  clientId: string;
  eventType:
    | "request_created"
    | "reminder_sent"
    | "upload_received"
    | "submission_marked"
    | "bookkeeper_verified"
    | "document_rejected"
    | "summary_generated"
    | "ai_draft_created"
    | "storage_connected";
  summary: string;
  createdAt: string;
};

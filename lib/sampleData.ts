import type { AccountSettings, AutomationEvent, Client, DocumentRequest, MonthlyRequest } from "./types";

export const defaultAccountSettings: AccountSettings = {
  firmName: "Piedmont Books & Advisory",
  storageProvider: "Google Drive",
  googleDriveConnected: true,
  googleDriveRootUrl: "https://drive.google.com/drive/my-drive",
  parentFolderName: "Month Close Documents",
  defaultPeriod: "June 2026"
};

export const defaultDocumentTypeNames = [
  "Bank statement",
  "Credit card statement",
  "Payroll report",
  "Receipt exports",
  "Vendor invoices",
  "Merchant processor statement",
  "Loan statement"
];

export const clients: Client[] = [
  {
    id: "c-001",
    businessName: "Queen City Dental Studio",
    contactName: "Maya Carter",
    email: "maya@example.com",
    assignedBookkeeper: "Nina",
    status: "waiting",
    lastReminderAt: "2026-06-17"
  },
  {
    id: "c-002",
    businessName: "South End Fitness LLC",
    contactName: "Drew Howard",
    email: "drew@example.com",
    assignedBookkeeper: "Nina",
    status: "ready"
  },
  {
    id: "c-003",
    businessName: "Lake Wylie Property Services",
    contactName: "Andre Bell",
    email: "andre@example.com",
    assignedBookkeeper: "Sam",
    status: "overdue",
    lastReminderAt: "2026-06-14"
  },
  {
    id: "c-004",
    businessName: "Ballantyne Med Spa",
    contactName: "Lena Brooks",
    email: "lena@example.com",
    assignedBookkeeper: "Sam",
    status: "new"
  }
];

export const monthlyRequests: MonthlyRequest[] = [
  {
    id: "mr-001",
    clientId: "c-001",
    title: "June 2026 Month-End Documents",
    period: "June 2026",
    dueDate: "2026-06-10",
    secureToken: "queen-city-june-demo-token",
    externalFolderUrl: defaultAccountSettings.googleDriveRootUrl,
    externalFolderLabel: "Google Drive · Month Close Documents / June 2026 / Queen City Dental Studio",
    externalFolderPath: "Month Close Documents / June 2026 / Queen City Dental Studio"
  },
  {
    id: "mr-002",
    clientId: "c-002",
    title: "June 2026 Month-End Documents",
    period: "June 2026",
    dueDate: "2026-06-10",
    secureToken: "south-end-fitness-june-demo-token",
    externalFolderUrl: defaultAccountSettings.googleDriveRootUrl,
    externalFolderLabel: "Google Drive · Month Close Documents / June 2026 / South End Fitness LLC",
    externalFolderPath: "Month Close Documents / June 2026 / South End Fitness LLC"
  },
  {
    id: "mr-003",
    clientId: "c-003",
    title: "June 2026 Month-End Documents",
    period: "June 2026",
    dueDate: "2026-06-10",
    secureToken: "lake-wylie-property-june-demo-token",
    externalFolderUrl: defaultAccountSettings.googleDriveRootUrl,
    externalFolderLabel: "Google Drive · Month Close Documents / June 2026 / Lake Wylie Property Services",
    externalFolderPath: "Month Close Documents / June 2026 / Lake Wylie Property Services"
  }
];

export const documentRequests: DocumentRequest[] = [
  {
    id: "dr-001",
    monthlyRequestId: "mr-001",
    clientId: "c-001",
    period: "June 2026",
    documentName: "Bank statement",
    status: "submitted",
    dueDate: "2026-06-10",
    submittedAt: "2026-06-08",
    clientNote: "Uploaded as the suggested file name.",
    externalFileName: "Queen City Dental Studio - June 2026 - Bank Statement.pdf",
    suggestedFileName: "Queen City Dental Studio - June 2026 - Bank Statement.pdf"
  },
  {
    id: "dr-002",
    monthlyRequestId: "mr-001",
    clientId: "c-001",
    period: "June 2026",
    documentName: "Payroll report",
    status: "missing",
    dueDate: "2026-06-10",
    suggestedFileName: "Queen City Dental Studio - June 2026 - Payroll Report.pdf"
  },
  {
    id: "dr-003",
    monthlyRequestId: "mr-001",
    clientId: "c-001",
    period: "June 2026",
    documentName: "Receipt exports",
    status: "missing",
    dueDate: "2026-06-10",
    suggestedFileName: "Queen City Dental Studio - June 2026 - Receipt Exports.pdf"
  },
  {
    id: "dr-004",
    monthlyRequestId: "mr-002",
    clientId: "c-002",
    period: "June 2026",
    documentName: "Bank statement",
    status: "verified",
    dueDate: "2026-06-10",
    submittedAt: "2026-06-05",
    verifiedAt: "2026-06-06",
    clientNote: "Uploaded to the June folder.",
    externalFileName: "South End Fitness LLC - June 2026 - Bank Statement.pdf",
    suggestedFileName: "South End Fitness LLC - June 2026 - Bank Statement.pdf"
  },
  {
    id: "dr-005",
    monthlyRequestId: "mr-002",
    clientId: "c-002",
    period: "June 2026",
    documentName: "Credit card statement",
    status: "reviewed",
    dueDate: "2026-06-10",
    submittedAt: "2026-06-06",
    verifiedAt: "2026-06-06",
    reviewedAt: "2026-06-07",
    externalFileName: "South End Fitness LLC - June 2026 - Credit Card Statement.pdf",
    suggestedFileName: "South End Fitness LLC - June 2026 - Credit Card Statement.pdf"
  },
  {
    id: "dr-006",
    monthlyRequestId: "mr-003",
    clientId: "c-003",
    period: "June 2026",
    documentName: "Vendor invoices",
    status: "overdue",
    dueDate: "2026-06-10",
    suggestedFileName: "Lake Wylie Property Services - June 2026 - Vendor Invoices.pdf"
  },
  {
    id: "dr-007",
    monthlyRequestId: "mr-003",
    clientId: "c-003",
    period: "June 2026",
    documentName: "Payroll report",
    status: "overdue",
    dueDate: "2026-06-10",
    suggestedFileName: "Lake Wylie Property Services - June 2026 - Payroll Report.pdf"
  }
];

export const automationEvents: AutomationEvent[] = [
  {
    id: "ev-001",
    clientId: "c-001",
    eventType: "request_created",
    summary: "Monthly document request created for Queen City Dental Studio.",
    createdAt: "2026-06-01T09:15:00.000Z"
  },
  {
    id: "ev-002",
    clientId: "c-001",
    eventType: "reminder_sent",
    summary: "Reminder sent for missing payroll report and receipt exports.",
    createdAt: "2026-06-17T14:30:00.000Z"
  },
  {
    id: "ev-003",
    clientId: "c-001",
    eventType: "submission_marked",
    summary: "Client marked bank statement as submitted after uploading to Google Drive.",
    createdAt: "2026-06-08T10:20:00.000Z"
  },
  {
    id: "ev-004",
    clientId: "c-002",
    eventType: "summary_generated",
    summary: "South End Fitness LLC marked ready for month-end close.",
    createdAt: "2026-06-07T11:45:00.000Z"
  },
  {
    id: "ev-005",
    clientId: "c-003",
    eventType: "ai_draft_created",
    summary: "AI follow-up draft created for overdue vendor invoices and payroll report.",
    createdAt: "2026-06-18T16:10:00.000Z"
  }
];

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookkeeperFlow | Workflow Automation Demo",
  description:
    "A portfolio demo for bookkeeping workflow automation: document collection, reminders, status tracking, weekly summaries, and finance operations visibility."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

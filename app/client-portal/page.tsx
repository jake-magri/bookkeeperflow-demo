import { ClientSubmissionDemo } from "@/components/ClientSubmissionDemo";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function ClientPortalPage() {
  return (
    <main className="page-shell">
      <Nav />
      <ClientSubmissionDemo />
      <Footer />
    </main>
  );
}

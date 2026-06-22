import { DashboardWorkflowDemo } from "@/components/DashboardWorkflowDemo";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <Nav />
      <DashboardWorkflowDemo />
      <Footer />
    </main>
  );
}

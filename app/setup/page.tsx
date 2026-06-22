import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SetupWizard } from "@/components/SetupWizard";

export default function SetupPage() {
  return (
    <main className="page-shell">
      <Nav />
      <SetupWizard />
      <Footer />
    </main>
  );
}

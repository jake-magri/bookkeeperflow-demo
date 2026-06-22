import { AccountSettingsDemo } from "@/components/AccountSettingsDemo";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function SettingsPage() {
  return (
    <main className="page-shell">
      <Nav />
      <AccountSettingsDemo />
      <Footer />
    </main>
  );
}

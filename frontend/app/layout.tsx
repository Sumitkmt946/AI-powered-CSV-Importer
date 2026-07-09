import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import SidebarWrapper from "@/components/SidebarWrapper";
import GlobalModal from "@/components/GlobalModal";

export const metadata: Metadata = {
  title: "GrowEasy – AI-Powered CSV Importer",
  description: "Import CRM leads from any CSV using AI-powered field mapping.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="app-shell">
            <SidebarWrapper />
            <main className="main-content">{children}</main>
          </div>
          <GlobalModal />
        </AppProvider>
      </body>
    </html>
  );
}

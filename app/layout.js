import { Chivo_Mono } from "next/font/google";
import "./globals.css";

const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-chivo-mono",
});

export const metadata = {
  title: "Apex — Client & Revenue Management for Developers",
  description: "The all-in-one platform for agencies, freelancers, and tech teams to manage clients, track projects, send invoices, and grow revenue.",
  keywords: ["CRM", "invoicing", "project management", "SaaS", "freelancers", "agencies", "developers"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={chivoMono.variable}>
      <body style={{ fontFamily: 'var(--font-chivo-mono), "Chivo Mono", monospace' }}>
        {children}
      </body>
    </html>
  );
}

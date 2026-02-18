import "./globals.css";

export const metadata = {
  title: "Apex — AI-Powered Client & Revenue Management",
  description: "The all-in-one platform for agencies, freelancers, and SMBs to manage clients, track projects, send invoices, and grow revenue with AI-powered insights.",
  keywords: ["CRM", "invoicing", "project management", "AI", "SaaS", "freelancers", "agencies"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

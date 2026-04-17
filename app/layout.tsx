import "./globals.css";
import type { Metadata } from "next";
import Provider from "@/components/Provider";

export const metadata: Metadata = {
  title: "E-comm",
  description: "Next.js e-commerce app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
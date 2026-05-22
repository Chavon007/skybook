import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/clientLayout";

export const metadata: Metadata = {
  title: "SkyBook",
  description: "Your flights, your way",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
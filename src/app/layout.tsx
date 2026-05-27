import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/clientLayout";
import AuthProvider from "@/components/AuthProvider";

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
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

"use client";
import Header from "@/components/header";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

const noHeaderRoutes = ["/", "/login", "/signup"];
const protectedRoutes = ["/flight", "/booking", "/result"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader = !noHeaderRoutes.includes(pathname);
  const { session } = useUserStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );
    if (isProtected && !session) {
      router.push("/login");
    }
  }, [pathname, session, router, hydrated]);

  if (!hydrated) return null;
  if (!showHeader) return <>{children}</>;

  return (
    <div
      className="relative min-h-screen bg-center bg-cover"
      style={{ backgroundImage: "url(/bg1.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10">
        <Header />
        {children}
      </div>
    </div>
  );
}

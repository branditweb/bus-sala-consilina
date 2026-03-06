"use client";

import { signOut } from "next-auth/react";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site";

export function AdminHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <p className="text-sm font-semibold tracking-wide text-brand-700">{siteConfig.name} · Admin</p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white"
        >
          Logout
        </button>
      </Container>
    </header>
  );
}

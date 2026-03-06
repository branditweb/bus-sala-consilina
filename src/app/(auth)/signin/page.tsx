"use client";

import { signIn } from "next-auth/react";

import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100">
      <SiteHeader />
      <section className="py-12">
        <Container className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Accesso Admin</h1>
            <p className="mt-2 text-sm text-slate-600">
              Accedi con Google per gestire il pannello amministrativo.
            </p>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="mt-6 w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white"
            >
              Accedi con Google
            </button>
          </div>
        </Container>
      </section>
    </main>
  );
}

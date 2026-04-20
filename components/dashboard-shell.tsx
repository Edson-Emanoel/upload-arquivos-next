import type { ReactNode } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

type DashboardShellProps = {
  activePath: string;
  title: string;
  description: string;
  userName: string;
  children: ReactNode;
};

export function DashboardShell({
  activePath,
  title,
  description,
  userName,
  children,
}: DashboardShellProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10">
      <header className="mb-8 flex flex-col gap-6 rounded-[1.9rem] border border-white/10 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Area autenticada
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {userName}
          </span>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold !text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Home
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <DashboardSidebar activePath={activePath} />
        <div>{children}</div>
      </div>
    </main>
  );
}

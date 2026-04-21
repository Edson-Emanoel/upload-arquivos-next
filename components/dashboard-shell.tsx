import type { ReactNode } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

type DashboardShellProps = {
  activePath: string;
  title: string;
  description: string;
  userName: string;
  fileCount?: number;
  showFileCount?: boolean;
  showSidebar?: boolean;
  showLogout?: boolean;
  children: ReactNode;
};

export function DashboardShell({
  activePath,
  title,
  description,
  userName,
  fileCount = 0,
  showFileCount = true,
  showSidebar = true,
  showLogout = true,
  children,
}: DashboardShellProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10">
      <header className="mb-8 flex flex-col gap-6 rounded-[1.9rem] border border-white/10 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">{description}</p>

        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {userName}
            </span>
            
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold !text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Home
            </Link>

            {showLogout ? (
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
                >
                  Sair
                </button>
              </form>
            ) : null}
          </div>

          {showFileCount ? (
            <span className="inline-flex items-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-sm font-semibold text-sky-900 shadow-sm">
              <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-sky-700 px-2 text-xs font-bold text-white">
                {fileCount}
              </span>
              <span>{fileCount === 1 ? "arquivo salvo" : "arquivos salvos"}</span>
            </span>
          ) : null}
        </div>
      </header>

      {showSidebar ? (
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <DashboardSidebar activePath={activePath} />
          <div>{children}</div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </main>
  );
}

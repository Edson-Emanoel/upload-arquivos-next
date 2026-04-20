import Link from "next/link";

type DashboardSidebarProps = {
  activePath: string;
};

const items = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/imagens/nova", label: "Nova imagem" },
  // { href: "/dashboard#galeria", label: "Galeria" },
];

export function DashboardSidebar({ activePath }: DashboardSidebarProps) {
  return (
    <aside className="rounded-[1.8rem] border border-white/10 bg-slate-950 p-5 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Painel</p>

      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const isActive = activePath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white !text-slate-950"
                  : "!text-slate-300 hover:bg-white/10 hover:!text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

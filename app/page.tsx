import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/75 shadow-[0_30px_120px_rgba(15,23,42,0.18)] backdrop-blur">
        <div className="grid gap-10 px-8 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-12 md:py-14">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-900">
              Projeto em construcao
            </span>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Plataforma para upload e gerenciamento de imagens.
              </h1>

              <p className="max-w-xl text-base leading-8 text-slate-700 md:text-lg">
                A base inicial do projeto ja foi preparada com Next.js, Prisma,
                armazenamento local de arquivos e sessao por cookie seguro.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Next.js
              </span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                SQLite
              </span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Prisma
              </span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Upload local
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/cadastro"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
              >
                Criar conta
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold !text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Fazer login
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-slate-100">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Proximos passos
            </p>

            <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <li>1. Validar o banco SQLite local.</li>
              <li>2. Gerar a migration inicial com Prisma.</li>
              <li>3. Testar o fluxo de cadastro e login.</li>
              <li>4. Criar o CRUD de imagens com upload local.</li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}

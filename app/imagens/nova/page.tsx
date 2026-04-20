import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { ImageForm } from "@/components/image-form";
import { getCurrentSession } from "@/lib/session";

export default async function NovaImagemPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardShell
      activePath="/imagens/nova"
      title="Novo cadastro de imagem"
      description="Frontend do formulario de criacao pronto para receber a integracao com upload e persistencia."
      userName={session.user.name}
    >
      <ImageForm mode="create" />
    </DashboardShell>
  );
}

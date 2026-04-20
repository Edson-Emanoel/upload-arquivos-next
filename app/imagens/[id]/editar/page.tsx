import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { ImageForm } from "@/components/image-form";
import { toUiImage } from "@/lib/images";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

type EditImagePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditImagePage({ params }: EditImagePageProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const image = await prisma.image.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!image) {
    notFound();
  }

  const uiImage = toUiImage(image);

  return (
    <DashboardShell
      activePath="/dashboard"
      title={`Editar: ${uiImage.title}`}
      description="Formulario de edicao conectado ao registro real da imagem."
      userName={session.user.name}
    >
      <ImageForm mode="edit" image={uiImage} />
    </DashboardShell>
  );
}

import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  getFileEntry,
  getStringEntry,
  isUnauthorizedError,
  toImageResponse,
  updateImageSchema,
} from "@/lib/images";
import { deleteImageFile, saveImageFile } from "@/lib/storage";

type ImageRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: ImageRouteProps) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const image = await prisma.image.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!image) {
      return Response.json({ error: "Imagem nao encontrada." }, { status: 404 });
    }

    return Response.json({
      image: toImageResponse(image),
    });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return Response.json({ error: "Nao autenticado." }, { status: 401 });
    }

    return Response.json(
      { error: "Nao foi possivel carregar a imagem." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: ImageRouteProps) {
  let newSavedPath: string | null = null;

  try {
    const user = await requireUser();
    const { id } = await params;
    const currentImage = await prisma.image.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!currentImage) {
      return Response.json({ error: "Imagem nao encontrada." }, { status: 404 });
    }

    const formData = await request.formData();
    const file = getFileEntry(formData, "file");
    const parsedData = updateImageSchema.parse({
      title: getStringEntry(formData, "title"),
    });

    const updateData: {
      title?: string;
      filename?: string;
      originalName?: string;
      mimeType?: string;
      size?: number;
      path?: string;
    } = {};

    if (parsedData.title !== undefined) {
      updateData.title = parsedData.title;
    }

    if (file) {
      const savedFile = await saveImageFile(file, user.name);
      newSavedPath = savedFile.path;

      updateData.filename = savedFile.filename;
      updateData.originalName = savedFile.originalName;
      updateData.mimeType = savedFile.mimeType;
      updateData.size = savedFile.size;
      updateData.path = savedFile.path;
    }

    const image = await prisma.image.update({
      where: {
        id: currentImage.id,
      },
      data: updateData,
    });

    if (newSavedPath) {
      await deleteImageFile(currentImage.path);
    }

    return Response.json({
      message: "Imagem atualizada com sucesso.",
      image: toImageResponse(image),
    });
  } catch (error) {
    if (newSavedPath) {
      await deleteImageFile(newSavedPath);
    }

    if (isUnauthorizedError(error)) {
      return Response.json({ error: "Nao autenticado." }, { status: 401 });
    }

    if (error instanceof ZodError) {
      return Response.json(
        { error: error.issues[0]?.message ?? "Dados invalidos." },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(
      { error: "Nao foi possivel atualizar a imagem." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: ImageRouteProps) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const image = await prisma.image.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!image) {
      return Response.json({ error: "Imagem nao encontrada." }, { status: 404 });
    }

    await prisma.image.delete({
      where: {
        id: image.id,
      },
    });

    await deleteImageFile(image.path);

    return Response.json({
      message: "Imagem excluida com sucesso.",
    });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return Response.json({ error: "Nao autenticado." }, { status: 401 });
    }

    return Response.json(
      { error: "Nao foi possivel excluir a imagem." },
      { status: 500 },
    );
  }
}

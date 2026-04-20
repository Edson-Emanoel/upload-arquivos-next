import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { createImageSchema, getFileEntry, getStringEntry, isUnauthorizedError, toImageResponse } from "@/lib/images";
import { deleteImageFile, saveImageFile } from "@/lib/storage";

export async function GET() {
  try {
    const user = await requireUser();

    const images = await prisma.image.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      images: images.map(toImageResponse),
    });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return Response.json({ error: "Nao autenticado." }, { status: 401 });
    }

    return Response.json(
      { error: "Nao foi possivel listar as imagens." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let savedFilePath: string | null = null;

  try {
    const user = await requireUser();
    const formData = await request.formData();
    const file = getFileEntry(formData, "file");

    if (!file) {
      return Response.json({ error: "Arquivo de imagem e obrigatorio." }, { status: 400 });
    }

    const data = createImageSchema.parse({
      title: getStringEntry(formData, "title"),
      description: getStringEntry(formData, "description"),
    });

    const savedFile = await saveImageFile(file, user.name);
    savedFilePath = savedFile.path;

    const image = await prisma.image.create({
      data: {
        title: data.title,
        description: data.description,
        filename: savedFile.filename,
        originalName: savedFile.originalName,
        mimeType: savedFile.mimeType,
        size: savedFile.size,
        path: savedFile.path,
        userId: user.id,
      },
    });

    return Response.json(
      {
        message: "Imagem criada com sucesso.",
        image: toImageResponse(image),
      },
      { status: 201 },
    );
  } catch (error) {
    if (savedFilePath) {
      await deleteImageFile(savedFilePath);
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
      { error: "Nao foi possivel criar a imagem." },
      { status: 500 },
    );
  }
}

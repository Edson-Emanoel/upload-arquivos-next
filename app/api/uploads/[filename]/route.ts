import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { isUnauthorizedError } from "@/lib/images";

type UploadRouteProps = {
  params: Promise<{
    filename: string;
  }>;
};

export async function GET(_request: Request, { params }: UploadRouteProps) {
  try {
    const user = await requireUser();
    const { filename } = await params;

    const image = await prisma.image.findFirst({
      where: {
        filename,
        userId: user.id,
      },
    });

    if (!image) {
      return new Response("Arquivo nao encontrado.", { status: 404 });
    }

    const fileBuffer = await readFile(path.resolve(process.cwd(), image.path));

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": String(fileBuffer.byteLength),
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return new Response("Nao autenticado.", { status: 401 });
    }

    return new Response("Nao foi possivel carregar o arquivo.", { status: 500 });
  }
}

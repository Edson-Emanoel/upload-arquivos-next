import { Prisma } from "@prisma/client";
import { formatZodError, loginSchema, toPublicUser } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return Response.json({ error: "Email ou senha invalidos." }, { status: 401 });
    }

    const passwordMatches = await verifyPassword(data.password, user.password);

    if (!passwordMatches) {
      return Response.json({ error: "Email ou senha invalidos." }, { status: 401 });
    }

    await createSession(user.id);

    return Response.json({
      message: "Login realizado com sucesso.",
      user: toPublicUser(user),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: "Dados invalidos.",
          details: formatZodError(error),
        },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return Response.json(
        {
          error:
            "Nao foi possivel inicializar o banco SQLite. Verifique o DATABASE_URL e o arquivo local do banco.",
        },
        { status: 500 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2021") {
        return Response.json(
          {
            error:
              "As tabelas do projeto ainda nao existem no banco. Execute a migration inicial do Prisma.",
          },
          { status: 500 },
        );
      }
    }

    return Response.json({ error: "Nao foi possivel fazer login." }, { status: 500 });
  }
}

import { Prisma } from "@prisma/client";
import { registerSchema, formatZodError, toPublicUser } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return Response.json(
        { error: "Ja existe um usuario com este email." },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password),
      },
    });

    await createSession(user.id);

    return Response.json(
      {
        message: "Conta criada com sucesso.",
        user: toPublicUser(user),
      },
      { status: 201 },
    );
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

    return Response.json(
      { error: "Nao foi possivel concluir o cadastro." },
      { status: 500 },
    );
  }
}

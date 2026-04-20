import { getCurrentSession } from "@/lib/session";
import { toPublicUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json({ error: "Nao autenticado." }, { status: 401 });
  }

  return Response.json({
    user: toPublicUser(session.user),
  });
}

import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(120, "Nome muito longo"),
  email: z.email("Informe um email valido").transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha muito longa"),
});

export const loginSchema = z.object({
  email: z.email("Informe um email valido").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Informe a senha"),
});

export function toPublicUser(user: { id: string; name: string; email: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export function formatZodError(error: z.ZodError) {
  const flattened = error.flatten();

  return {
    formErrors: flattened.formErrors,
    fieldErrors: flattened.fieldErrors,
  };
}

import { z } from "zod";

export const createImageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Titulo deve ter pelo menos 3 caracteres")
    .max(120, "Titulo muito longo"),
  description: z
    .string()
    .trim()
    .max(500, "Descricao muito longa")
    .optional()
    .transform((value) => value || null),
});

export const updateImageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Titulo deve ter pelo menos 3 caracteres")
    .max(120, "Titulo muito longo")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Descricao muito longa")
    .optional()
    .transform((value) => value || null),
});

type PersistedImage = {
  id: string;
  title: string;
  description: string | null;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UiImage = {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  createdAtLabel: string;
  sizeLabel: string;
  fileTypeLabel: string;
  accentFrom: string;
  accentTo: string;
  imageUrl: string;
};

export function toImageResponse(image: PersistedImage) {
  return {
    id: image.id,
    title: image.title,
    description: image.description,
    filename: image.filename,
    originalName: image.originalName,
    mimeType: image.mimeType,
    size: image.size,
    path: image.path,
    imageUrl: `/api/uploads/${image.filename}`,
    userId: image.userId,
    createdAt: image.createdAt,
    updatedAt: image.updatedAt,
  };
}

export function toUiImage(image: PersistedImage): UiImage {
  const [accentFrom, accentTo] = getAccentPair(image.id);

  return {
    id: image.id,
    title: image.title,
    description: image.description ?? "Sem descricao informada.",
    subtitle: image.originalName,
    createdAtLabel: formatDate(image.createdAt),
    sizeLabel: formatFileSize(image.size),
    fileTypeLabel: image.mimeType.replace("image/", "").toUpperCase(),
    accentFrom,
    accentTo,
    imageUrl: `/api/uploads/${image.filename}`,
  };
}

export function getStringEntry(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return undefined;
  }

  return value;
}

export function getFileEntry(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File)) {
    return null;
  }

  if (!value.size && !value.name) {
    return null;
  }

  return value;
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message === "Unauthorized";
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function getAccentPair(seed: string) {
  const palette = [
    ["#f59e0b", "#fb7185"],
    ["#0f172a", "#2563eb"],
    ["#166534", "#84cc16"],
    ["#0f766e", "#22c55e"],
    ["#7c3aed", "#ec4899"],
    ["#475569", "#c084fc"],
  ] as const;

  const index =
    Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    palette.length;

  return palette[index];
}

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { env } from "./env";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024;

export async function ensureUploadDirectory() {
  const uploadDirectory = path.resolve(process.cwd(), env.UPLOAD_DIR);
  await mkdir(uploadDirectory, { recursive: true });
  return uploadDirectory;
}

export async function ensureUserUploadDirectory(userName: string) {
  const uploadDirectory = await ensureUploadDirectory();
  const userDirectoryName = sanitizeDirectoryName(userName);
  const userUploadDirectory = path.join(uploadDirectory, userDirectoryName);

  await mkdir(userUploadDirectory, { recursive: true });

  return {
    userDirectoryName,
    userUploadDirectory,
  };
}

export function validateImageFile(file: File) {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Tipo de arquivo nao permitido");
  }

  if (file.size > MAX_FILE_SIZE_IN_BYTES) {
    throw new Error("Arquivo excede o limite de 5MB");
  }
}

export async function saveImageFile(file: File, userName: string) {
  validateImageFile(file);

  const { userDirectoryName, userUploadDirectory } =
    await ensureUserUploadDirectory(userName);
  const extension = path.extname(file.name) || getExtensionFromMimeType(file.type);
  const filename = `${randomUUID()}${extension}`;
  const filePath = path.join(userUploadDirectory, filename);
  const arrayBuffer = await file.arrayBuffer();

  await writeFile(filePath, Buffer.from(arrayBuffer));

  return {
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    path: path
      .join(env.UPLOAD_DIR, userDirectoryName, filename)
      .replaceAll("\\", "/"),
  };
}

export async function deleteImageFile(relativePath: string) {
  const normalizedPath = relativePath.replaceAll("/", path.sep);
  const absolutePath = path.resolve(process.cwd(), normalizedPath);

  try {
    await unlink(absolutePath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }
}

function getExtensionFromMimeType(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return "";
  }
}

function sanitizeDirectoryName(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "usuario";
}

// backend/src/lib/r2.js
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const requiredEnv = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_BASE_URL",
];

function getR2Config() {
  for (const envKey of requiredEnv) {
    if (!process.env[envKey]) {
      throw new Error(`Missing required env var: ${envKey}`);
    }
  }

  return {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
  };
}

const ALLOWED_SCOPES = new Set(["exhibitions", "actions", "misc"]);

function normalizeBase(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function sanitizeScope(scope) {
  const normalized = normalizeBase(scope).replace(/[\\/]/g, "");
  if (!ALLOWED_SCOPES.has(normalized)) {
    return "misc";
  }
  return normalized;
}

export function sanitizeSlug(slug) {
  return normalizeBase(slug)
    .replace(/[\\/]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "");
}

export function sanitizeFilename(filename) {
  const basename =
    String(filename || "")
      .split(/[\\/]/)
      .pop() || "file";

  const sanitized = normalizeBase(basename)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "");

  return sanitized || "file";
}

let r2Client = null;

export function getR2Client() {
  if (r2Client) {
    return r2Client;
  }

  const config = getR2Config();

  r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return r2Client;
}

export function buildR2Key({ scope, slug, filename }) {
  const safeScope = sanitizeScope(scope);
  const safeSlug = sanitizeSlug(slug);
  const safeFilename = sanitizeFilename(filename);
  const timestamp = Date.now();

  if (safeSlug) {
    return `${safeScope}/${safeSlug}/${timestamp}-${safeFilename}`;
  }

  return `${safeScope}/${timestamp}-${safeFilename}`;
}

export async function uploadToR2({ key, body, contentType }) {
  if (!String(key || "").trim()) {
    throw new Error("uploadToR2: key is required");
  }

  if (body == null) {
    throw new Error("uploadToR2: body is required");
  }

  const config = getR2Config();
  const safeKey = String(key).trim();

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: safeKey,
      Body: body,
      ContentType: contentType || "application/octet-stream",
    }),
  );

  return {
    key: safeKey,
    url: getPublicUrl(safeKey),
  };
}

export async function deleteFromR2(key) {
  if (!String(key || "").trim()) {
    throw new Error("deleteFromR2: key is required");
  }

  const config = getR2Config();

  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: String(key).trim(),
    }),
  );
}

export function getPublicUrl(key) {
  if (!key) {
    throw new Error("getPublicUrl: key is required");
  }

  const config = getR2Config();
  const baseUrl = config.publicBaseUrl.replace(/\/+$/, "");
  const safeKey = String(key).replace(/^\/+/, "");

  return `${baseUrl}/${safeKey}`;
}

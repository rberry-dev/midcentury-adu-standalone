import { requestUploadUrl } from "@/lib/api";

export interface UploadResult {
  objectPath: string;
  publicUrl: string;
}

/**
 * Upload a file via the presigned-URL flow.
 *  1. Ask the backend (admin-gated) for a presigned URL.
 *  2. PUT the file bytes directly to GCS.
 *  3. Return the path that should be stored in the database, plus the
 *     public URL the site should use to render the image.
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  const meta = {
    name: file.name,
    size: file.size,
    contentType: file.type || "application/octet-stream",
  };

  const { uploadURL, objectPath } = await requestUploadUrl(meta);

  const putRes = await fetch(uploadURL, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": meta.contentType },
  });
  if (!putRes.ok) {
    throw new Error(`Upload failed (${putRes.status})`);
  }

  const publicUrl = `/api/storage${objectPath}`;
  return { objectPath, publicUrl };
}

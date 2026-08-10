import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: { folder?: string; resourceType?: "image" | "raw" | "auto"; filename?: string } = {}
): Promise<UploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials are not configured on the server.");
  }

  const folder = options.folder ?? "portfolio";
  const resourceType = options.resourceType ?? "auto";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: options.filename ? options.filename.split(".")[0] : undefined,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export { cloudinary };

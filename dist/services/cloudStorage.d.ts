export interface UploadResult {
    url: string;
    publicId: string;
}
/**
 * Uploads a PDF buffer to Cloudinary under the `medivantage/prescriptions`
 * folder. Falls back gracefully when credentials are not configured so that
 * local development still works (the prescription controller catches the error
 * and returns a base64 data URL instead).
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */
export declare function uploadToCloud(buffer: Buffer, filename: string): Promise<UploadResult>;
//# sourceMappingURL=cloudStorage.d.ts.map
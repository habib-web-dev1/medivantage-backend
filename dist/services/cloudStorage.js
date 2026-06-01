"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloud = uploadToCloud;
const cloudinary_1 = require("cloudinary");
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
async function uploadToCloud(buffer, filename) {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary credentials not configured. " +
            "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
    }
    cloudinary_1.v2.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: "raw",
            folder: "medivantage/prescriptions",
            public_id: filename.replace(/\.pdf$/, ""),
            format: "pdf",
        }, (error, result) => {
            if (error || !result) {
                reject(error ?? new Error("Cloudinary upload returned no result"));
                return;
            }
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        uploadStream.end(buffer);
    });
}
//# sourceMappingURL=cloudStorage.js.map
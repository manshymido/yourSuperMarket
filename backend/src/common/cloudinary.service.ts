import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'yoursupermarket/products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : typeof error === 'string'
                  ? error
                  : JSON.stringify(error);
            reject(new Error(`Upload failed: ${errorMessage}`));
          } else if (!result) {
            reject(new Error('Upload failed: No result returned'));
          } else {
            resolve(result.secure_url);
          }
        },
      );

      const buffer = Readable.from(file.buffer);
      buffer.pipe(uploadStream);
    });
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return `yoursupermarket/products/${filename.split('.')[0]}`;
  }
}

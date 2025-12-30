"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let CloudinaryService = class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'yoursupermarket/products',
                resource_type: 'image',
            }, (error, result) => {
                if (error) {
                    const errorMessage = error instanceof Error
                        ? error.message
                        : typeof error === 'string'
                            ? error
                            : JSON.stringify(error);
                    reject(new Error(`Upload failed: ${errorMessage}`));
                }
                else if (!result) {
                    reject(new Error('Upload failed: No result returned'));
                }
                else {
                    resolve(result.secure_url);
                }
            });
            const buffer = stream_1.Readable.from(file.buffer);
            buffer.pipe(uploadStream);
        });
    }
    async uploadMultipleImages(files) {
        const uploadPromises = files.map((file) => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }
    async deleteImage(publicId) {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    extractPublicId(url) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return `yoursupermarket/products/${filename.split('.')[0]}`;
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map
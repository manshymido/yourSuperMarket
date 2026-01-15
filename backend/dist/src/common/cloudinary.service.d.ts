export declare class CloudinaryService {
    constructor();
    uploadImage(file: Express.Multer.File): Promise<string>;
    uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]>;
    deleteImage(publicId: string): Promise<void>;
    extractPublicId(url: string): string;
}

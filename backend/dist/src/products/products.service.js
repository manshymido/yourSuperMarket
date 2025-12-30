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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const cloudinary_service_1 = require("../common/cloudinary.service");
const utils_1 = require("../common/utils");
let ProductsService = ProductsService_1 = class ProductsService {
    prisma;
    cloudinaryService;
    logger = new common_1.Logger(ProductsService_1.name);
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createProductDto, files) {
        const slug = (0, utils_1.slugify)(createProductDto.name);
        let uniqueSlug = slug;
        let counter = 1;
        while (await this.prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        let imageUrls = createProductDto.images || [];
        if (files && files.length > 0) {
            const uploadedImages = await this.cloudinaryService.uploadMultipleImages(files);
            imageUrls = [...imageUrls, ...uploadedImages];
        }
        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                slug: uniqueSlug,
                images: imageUrls,
            },
            include: {
                category: true,
                inventory: true,
                _count: {
                    select: { reviews: true },
                },
            },
        });
        await this.prisma.inventory.create({
            data: {
                productId: product.id,
                quantity: 0,
            },
        });
        return product;
    }
    async findAll(query) {
        const { search, categoryId, minPrice, maxPrice, isFeatured, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', } = query;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = minPrice;
            }
            if (maxPrice !== undefined) {
                where.price.lte = maxPrice;
            }
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                    inventory: true,
                    _count: {
                        select: { reviews: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    include: {
                        parent: true,
                    },
                },
                inventory: true,
                reviews: {
                    where: { isApproved: true },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                _count: {
                    select: { reviews: true },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: {
                    include: {
                        parent: true,
                    },
                },
                inventory: true,
                reviews: {
                    where: { isApproved: true },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: { reviews: true },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto, files) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const data = { ...updateProductDto };
        if (updateProductDto.name && updateProductDto.name !== product.name) {
            const slug = (0, utils_1.slugify)(updateProductDto.name);
            let uniqueSlug = slug;
            let counter = 1;
            while (await this.prisma.product.findFirst({
                where: { slug: uniqueSlug, id: { not: id } },
            })) {
                uniqueSlug = `${slug}-${counter}`;
                counter++;
            }
            data.slug = uniqueSlug;
        }
        if (files && files.length > 0) {
            const uploadedImages = await this.cloudinaryService.uploadMultipleImages(files);
            const existingImages = product.images || [];
            data.images = [...existingImages, ...uploadedImages];
        }
        return this.prisma.product.update({
            where: { id },
            data,
            include: {
                category: true,
                inventory: true,
            },
        });
    }
    async remove(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                try {
                    const publicId = this.cloudinaryService.extractPublicId(imageUrl);
                    await this.cloudinaryService.deleteImage(publicId);
                }
                catch (error) {
                    const errorStack = error instanceof Error ? error.stack : undefined;
                    this.logger.error(`Failed to delete image: ${imageUrl}`, errorStack);
                }
            }
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], ProductsService);
//# sourceMappingURL=products.service.js.map
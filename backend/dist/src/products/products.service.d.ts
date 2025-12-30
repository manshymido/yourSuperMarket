import { PrismaService } from '../common/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CloudinaryService } from '../common/cloudinary.service';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    private cloudinaryService;
    private readonly logger;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
    create(createProductDto: CreateProductDto, files?: Express.Multer.File[]): Promise<{
        category: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        };
        inventory: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            lowStockThreshold: number;
            reserved: number;
            productId: string;
        } | null;
        _count: {
            reviews: number;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        categoryId: string;
        price: Prisma.Decimal;
        compareAtPrice: Prisma.Decimal | null;
        sku: string | null;
        barcode: string | null;
        images: string[];
        isFeatured: boolean;
        weight: Prisma.Decimal | null;
        unit: string | null;
    }>;
    findAll(query: ProductQueryDto): Promise<{
        products: ({
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
                slug: string;
            };
            inventory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                lowStockThreshold: number;
                reserved: number;
                productId: string;
            } | null;
            _count: {
                reviews: number;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            slug: string;
            categoryId: string;
            price: Prisma.Decimal;
            compareAtPrice: Prisma.Decimal | null;
            sku: string | null;
            barcode: string | null;
            images: string[];
            isFeatured: boolean;
            weight: Prisma.Decimal | null;
            unit: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        category: {
            parent: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
                slug: string;
            } | null;
        } & {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        };
        inventory: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            lowStockThreshold: number;
            reserved: number;
            productId: string;
        } | null;
        reviews: ({
            user: {
                firstName: string | null;
                lastName: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            productId: string;
            isApproved: boolean;
            rating: number;
            comment: string | null;
        })[];
        _count: {
            reviews: number;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        categoryId: string;
        price: Prisma.Decimal;
        compareAtPrice: Prisma.Decimal | null;
        sku: string | null;
        barcode: string | null;
        images: string[];
        isFeatured: boolean;
        weight: Prisma.Decimal | null;
        unit: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            parent: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
                slug: string;
            } | null;
        } & {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        };
        inventory: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            lowStockThreshold: number;
            reserved: number;
            productId: string;
        } | null;
        reviews: ({
            user: {
                firstName: string | null;
                lastName: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            productId: string;
            isApproved: boolean;
            rating: number;
            comment: string | null;
        })[];
        _count: {
            reviews: number;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        categoryId: string;
        price: Prisma.Decimal;
        compareAtPrice: Prisma.Decimal | null;
        sku: string | null;
        barcode: string | null;
        images: string[];
        isFeatured: boolean;
        weight: Prisma.Decimal | null;
        unit: string | null;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<{
        category: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        };
        inventory: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            lowStockThreshold: number;
            reserved: number;
            productId: string;
        } | null;
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        categoryId: string;
        price: Prisma.Decimal;
        compareAtPrice: Prisma.Decimal | null;
        sku: string | null;
        barcode: string | null;
        images: string[];
        isFeatured: boolean;
        weight: Prisma.Decimal | null;
        unit: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

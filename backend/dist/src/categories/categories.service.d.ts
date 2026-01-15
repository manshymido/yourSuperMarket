import { PrismaService } from '../common/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SlugService } from '../common/slug.service';
export declare class CategoriesService {
    private prisma;
    private slugService;
    constructor(prisma: PrismaService, slugService: SlugService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        _count: {
            products: number;
        };
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
        children: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        }[];
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
    }>;
    findAll(includeInactive?: boolean): Promise<({
        _count: {
            products: number;
        };
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
        children: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        }[];
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
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            products: number;
        };
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
        children: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        }[];
        products: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            slug: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
            sku: string | null;
            barcode: string | null;
            categoryId: string;
            images: string[];
            isFeatured: boolean;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            unit: string | null;
        }[];
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
    }>;
    findBySlug(slug: string): Promise<{
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
        children: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        }[];
        products: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            slug: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
            sku: string | null;
            barcode: string | null;
            categoryId: string;
            images: string[];
            isFeatured: boolean;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            unit: string | null;
        }[];
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
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
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
        children: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            image: string | null;
            parentId: string | null;
            slug: string;
        }[];
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

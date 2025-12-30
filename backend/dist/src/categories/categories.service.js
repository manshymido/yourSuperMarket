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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const utils_1 = require("../common/utils");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const slug = (0, utils_1.slugify)(createCategoryDto.name);
        let uniqueSlug = slug;
        let counter = 1;
        while (await this.prisma.category.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                slug: uniqueSlug,
            },
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
        });
    }
    async findAll(includeInactive = false) {
        return this.prisma.category.findMany({
            where: includeInactive ? {} : { isActive: true },
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                products: {
                    where: { isActive: true },
                    take: 10,
                },
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: true,
                products: {
                    where: { isActive: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const data = {
            ...updateCategoryDto,
        };
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const slug = (0, utils_1.slugify)(updateCategoryDto.name);
            let uniqueSlug = slug;
            let counter = 1;
            while (await this.prisma.category.findFirst({
                where: { slug: uniqueSlug, id: { not: id } },
            })) {
                uniqueSlug = `${slug}-${counter}`;
                counter++;
            }
            data.slug = uniqueSlug;
        }
        return this.prisma.category.update({
            where: { id },
            data,
            include: {
                parent: true,
                children: true,
            },
        });
    }
    async remove(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const productCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productCount > 0) {
            throw new Error('Cannot delete category with products');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map
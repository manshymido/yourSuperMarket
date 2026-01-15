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
exports.SlugService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const utils_1 = require("./utils");
let SlugService = class SlugService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateUniqueSlug(text, model, excludeId) {
        const baseSlug = (0, utils_1.slugify)(text);
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (await this.slugExists(uniqueSlug, model, excludeId)) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        return uniqueSlug;
    }
    async slugExists(slug, model, excludeId) {
        if (model === 'product') {
            if (excludeId) {
                const result = await this.prisma.product.findFirst({
                    where: { slug, id: { not: excludeId } },
                });
                return !!result;
            }
            else {
                const result = await this.prisma.product.findUnique({
                    where: { slug },
                });
                return !!result;
            }
        }
        else {
            if (excludeId) {
                const result = await this.prisma.category.findFirst({
                    where: { slug, id: { not: excludeId } },
                });
                return !!result;
            }
            else {
                const result = await this.prisma.category.findUnique({
                    where: { slug },
                });
                return !!result;
            }
        }
    }
};
exports.SlugService = SlugService;
exports.SlugService = SlugService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SlugService);
//# sourceMappingURL=slug.service.js.map
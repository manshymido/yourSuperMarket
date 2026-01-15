import { PrismaService } from './prisma.service';
export declare class SlugService {
    private prisma;
    constructor(prisma: PrismaService);
    generateUniqueSlug(text: string, model: 'product' | 'category', excludeId?: string): Promise<string>;
    private slugExists;
}

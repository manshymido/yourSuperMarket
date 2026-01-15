export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    barcode?: string;
    categoryId: string;
    images?: string[];
    isActive?: boolean;
    isFeatured?: boolean;
    weight?: number;
    unit?: string;
}

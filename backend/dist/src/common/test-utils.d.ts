import { Prisma } from '@prisma/client';
export declare const createMockUser: (overrides?: Partial<Prisma.UserCreateInput>) => {
    id: string;
    email: string | null;
    phone: string | null;
    password: string;
    firstName: string | null;
    lastName: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    isActive: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    addresses?: Prisma.AddressCreateNestedManyWithoutUserInput;
    cart?: Prisma.CartCreateNestedOneWithoutUserInput;
    orders?: Prisma.OrderCreateNestedManyWithoutUserInput;
    reviews?: Prisma.ReviewCreateNestedManyWithoutUserInput;
    deliveries?: Prisma.DeliveryCreateNestedManyWithoutDriverInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    passwordResetTokens?: Prisma.PasswordResetTokenCreateNestedManyWithoutUserInput;
};
export declare const createMockProduct: (overrides?: Partial<Prisma.ProductCreateInput>) => {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: Prisma.Decimal | Prisma.DecimalJsLike | number | string;
    compareAtPrice: Prisma.Decimal | Prisma.DecimalJsLike | number | string | null;
    sku: string | null;
    barcode: string | null;
    images: Prisma.ProductCreateimagesInput | string[];
    isActive: boolean;
    isFeatured: boolean;
    weight: Prisma.Decimal | Prisma.DecimalJsLike | number | string | null;
    unit: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    category?: Prisma.CategoryCreateNestedOneWithoutProductsInput | undefined;
    cartItems?: Prisma.CartItemCreateNestedManyWithoutProductInput;
    orderItems?: Prisma.OrderItemCreateNestedManyWithoutProductInput;
    reviews?: Prisma.ReviewCreateNestedManyWithoutProductInput;
    inventory?: Prisma.InventoryCreateNestedOneWithoutProductInput;
    categoryId: string;
};
export declare const createMockCategory: (overrides?: Partial<Prisma.CategoryCreateInput>) => {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    isActive: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    parent?: Prisma.CategoryCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CategoryCreateNestedManyWithoutParentInput;
    products?: Prisma.ProductCreateNestedManyWithoutCategoryInput;
    parentId: null;
};
export declare const createMockInventory: (overrides?: Partial<Prisma.InventoryCreateInput>) => {
    id: string;
    quantity: number;
    lowStockThreshold: number;
    reserved: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    product?: Prisma.ProductCreateNestedOneWithoutInventoryInput | undefined;
    productId: string;
};
export declare const createMockOrder: (overrides?: Partial<Prisma.OrderCreateInput>) => {
    id: string;
    orderNumber: string;
    status: import("@prisma/client").$Enums.OrderStatus;
    subtotal: Prisma.Decimal | Prisma.DecimalJsLike | number | string;
    deliveryFee: Prisma.Decimal | Prisma.DecimalJsLike | number | string;
    tax: Prisma.Decimal | Prisma.DecimalJsLike | number | string;
    total: Prisma.Decimal | Prisma.DecimalJsLike | number | string;
    notes: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutOrdersInput | undefined;
    address?: Prisma.AddressCreateNestedOneWithoutOrdersInput | undefined;
    items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutOrderInput;
    delivery?: Prisma.DeliveryCreateNestedOneWithoutOrderInput;
    userId: string;
    addressId: string;
};
export declare const createMockAddress: (overrides?: Partial<Prisma.AddressCreateInput>) => {
    id: string;
    label: string | null;
    street: string;
    city: string;
    governorate: string;
    postalCode: string | null;
    isDefault: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutAddressesInput | undefined;
    orders?: Prisma.OrderCreateNestedManyWithoutAddressInput;
    userId: string;
};
export declare const createMockCart: (overrides?: Partial<Prisma.CartCreateInput>) => {
    id: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutCartInput | undefined;
    items?: Prisma.CartItemCreateNestedManyWithoutCartInput;
    userId: string;
};
export declare const createMockCartItem: (overrides?: Partial<Prisma.CartItemCreateInput>) => {
    id: string;
    quantity: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    cart?: Prisma.CartCreateNestedOneWithoutItemsInput | undefined;
    product?: Prisma.ProductCreateNestedOneWithoutCartItemsInput | undefined;
    cartId: string;
    productId: string;
};
export declare const createMockPayment: (overrides?: Partial<Prisma.PaymentCreateInput>) => {
    id: string;
    amount: Prisma.Decimal | Prisma.DecimalJsLike | number | string;
    method: import("@prisma/client").$Enums.PaymentMethod;
    status: import("@prisma/client").$Enums.PaymentStatus;
    transactionId: string | null;
    paymobOrderId: string | null;
    paidAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    order?: Prisma.OrderCreateNestedOneWithoutPaymentInput | undefined;
    orderId: string;
};
export declare const createMockDelivery: (overrides?: Partial<Prisma.DeliveryCreateInput>) => {
    id: string;
    status: import("@prisma/client").$Enums.DeliveryStatus;
    estimatedDeliveryTime: Date | string | null;
    actualDeliveryTime: Date | string | null;
    driverNotes?: string | null;
    customerNotes?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    order?: Prisma.OrderCreateNestedOneWithoutDeliveryInput | undefined;
    driver?: Prisma.UserCreateNestedOneWithoutDeliveriesInput;
    governorate?: Prisma.GovernorateCreateNestedOneWithoutDeliveriesInput | undefined;
    orderId: string;
    driverId: null;
    governorateId: string;
};
export declare const createMockPrismaService: () => {
    user: {
        findUnique: jest.Mock<any, any, any>;
        findFirst: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
    };
    product: {
        findUnique: jest.Mock<any, any, any>;
        findFirst: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
    };
    category: {
        findUnique: jest.Mock<any, any, any>;
        findFirst: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
    };
    inventory: {
        findUnique: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
    };
    order: {
        findUnique: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
        aggregate: jest.Mock<any, any, any>;
    };
    address: {
        findUnique: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        updateMany: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
    };
    cart: {
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
    };
    cartItem: {
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
        deleteMany: jest.Mock<any, any, any>;
    };
    payment: {
        findUnique: jest.Mock<any, any, any>;
        findFirst: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
    };
    delivery: {
        findUnique: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
    };
    governorate: {
        findFirst: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
    };
    review: {
        findUnique: jest.Mock<any, any, any>;
        findMany: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        count: jest.Mock<any, any, any>;
    };
    orderItem: {
        findFirst: jest.Mock<any, any, any>;
    };
    refreshToken: {
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        delete: jest.Mock<any, any, any>;
        deleteMany: jest.Mock<any, any, any>;
    };
    passwordResetToken: {
        findUnique: jest.Mock<any, any, any>;
        create: jest.Mock<any, any, any>;
        update: jest.Mock<any, any, any>;
        updateMany: jest.Mock<any, any, any>;
    };
    $transaction: jest.Mock<any, any, any>;
};

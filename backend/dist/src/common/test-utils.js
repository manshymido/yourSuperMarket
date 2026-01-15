"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockPrismaService = exports.createMockDelivery = exports.createMockPayment = exports.createMockCartItem = exports.createMockCart = exports.createMockAddress = exports.createMockOrder = exports.createMockInventory = exports.createMockCategory = exports.createMockProduct = exports.createMockUser = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const createMockUser = (overrides) => ({
    id: 'user-123',
    email: 'test@example.com',
    phone: '1234567890',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: client_1.UserRole.CUSTOMER,
    isActive: true,
    emailVerified: false,
    phoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockUser = createMockUser;
const createMockProduct = (overrides) => ({
    id: 'product-123',
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    price: new client_2.Prisma.Decimal('99.99'),
    compareAtPrice: null,
    sku: 'SKU-123',
    barcode: null,
    categoryId: 'category-123',
    images: [],
    isActive: true,
    isFeatured: false,
    weight: null,
    unit: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockProduct = createMockProduct;
const createMockCategory = (overrides) => ({
    id: 'category-123',
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test category description',
    image: null,
    parentId: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockCategory = createMockCategory;
const createMockInventory = (overrides) => ({
    id: 'inventory-123',
    productId: 'product-123',
    quantity: 100,
    lowStockThreshold: 10,
    reserved: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockInventory = createMockInventory;
const createMockOrder = (overrides) => ({
    id: 'order-123',
    userId: 'user-123',
    addressId: 'address-123',
    orderNumber: 'ORD-123',
    status: client_1.OrderStatus.PENDING,
    subtotal: new client_2.Prisma.Decimal('100.00'),
    deliveryFee: new client_2.Prisma.Decimal('10.00'),
    tax: new client_2.Prisma.Decimal('14.00'),
    total: new client_2.Prisma.Decimal('124.00'),
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockOrder = createMockOrder;
const createMockAddress = (overrides) => ({
    id: 'address-123',
    userId: 'user-123',
    label: 'Home',
    street: '123 Main St',
    city: 'Cairo',
    governorate: 'Cairo',
    postalCode: '12345',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockAddress = createMockAddress;
const createMockCart = (overrides) => ({
    id: 'cart-123',
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockCart = createMockCart;
const createMockCartItem = (overrides) => ({
    id: 'cart-item-123',
    cartId: 'cart-123',
    productId: 'product-123',
    quantity: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockCartItem = createMockCartItem;
const createMockPayment = (overrides) => ({
    id: 'payment-123',
    orderId: 'order-123',
    amount: new client_2.Prisma.Decimal('124.00'),
    method: client_1.PaymentMethod.CASH_ON_DELIVERY,
    status: client_1.PaymentStatus.PENDING,
    transactionId: null,
    paymobOrderId: null,
    paidAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockPayment = createMockPayment;
const createMockDelivery = (overrides) => ({
    id: 'delivery-123',
    orderId: 'order-123',
    driverId: null,
    governorateId: 'governorate-123',
    status: client_1.DeliveryStatus.PENDING,
    estimatedDeliveryTime: null,
    actualDeliveryTime: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createMockDelivery = createMockDelivery;
const createMockPrismaService = () => ({
    user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    product: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    category: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    inventory: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    order: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
    },
    address: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
    },
    cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    cartItem: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
    payment: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    delivery: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    governorate: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
    },
    review: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
    },
    orderItem: {
        findFirst: jest.fn(),
    },
    refreshToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
    passwordResetToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
});
exports.createMockPrismaService = createMockPrismaService;
//# sourceMappingURL=test-utils.js.map
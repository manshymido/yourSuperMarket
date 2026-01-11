import { UserRole, OrderStatus, PaymentStatus, PaymentMethod, DeliveryStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

/**
 * Test utilities for creating mock data
 */

export const createMockUser = (overrides?: Partial<Prisma.UserCreateInput>) => ({
  id: 'user-123',
  email: 'test@example.com',
  phone: '1234567890',
  password: 'hashedPassword',
  firstName: 'John',
  lastName: 'Doe',
  role: UserRole.CUSTOMER,
  isActive: true,
  emailVerified: false,
  phoneVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockProduct = (overrides?: Partial<Prisma.ProductCreateInput>) => ({
  id: 'product-123',
  name: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  price: new Prisma.Decimal('99.99'),
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

export const createMockCategory = (overrides?: Partial<Prisma.CategoryCreateInput>) => ({
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

export const createMockInventory = (overrides?: Partial<Prisma.InventoryCreateInput>) => ({
  id: 'inventory-123',
  productId: 'product-123',
  quantity: 100,
  lowStockThreshold: 10,
  reserved: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockOrder = (overrides?: Partial<Prisma.OrderCreateInput>) => ({
  id: 'order-123',
  userId: 'user-123',
  addressId: 'address-123',
  orderNumber: 'ORD-123',
  status: OrderStatus.PENDING,
  subtotal: new Prisma.Decimal('100.00'),
  deliveryFee: new Prisma.Decimal('10.00'),
  tax: new Prisma.Decimal('14.00'),
  total: new Prisma.Decimal('124.00'),
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockAddress = (overrides?: Partial<Prisma.AddressCreateInput>) => ({
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

export const createMockCart = (overrides?: Partial<Prisma.CartCreateInput>) => ({
  id: 'cart-123',
  userId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockCartItem = (overrides?: Partial<Prisma.CartItemCreateInput>) => ({
  id: 'cart-item-123',
  cartId: 'cart-123',
  productId: 'product-123',
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockPayment = (overrides?: Partial<Prisma.PaymentCreateInput>) => ({
  id: 'payment-123',
  orderId: 'order-123',
  amount: new Prisma.Decimal('124.00'),
  method: PaymentMethod.CASH_ON_DELIVERY,
  status: PaymentStatus.PENDING,
  transactionId: null,
  paymobOrderId: null,
  paidAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockDelivery = (overrides?: Partial<Prisma.DeliveryCreateInput>) => ({
  id: 'delivery-123',
  orderId: 'order-123',
  driverId: null,
  governorateId: 'governorate-123',
  status: DeliveryStatus.PENDING,
  estimatedDeliveryTime: null,
  actualDeliveryTime: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockPrismaService = () => ({
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

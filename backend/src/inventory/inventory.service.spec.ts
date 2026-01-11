import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../common/prisma.service';
import { ProductHelperService } from '../common/product-helper.service';
import {
  createMockPrismaService,
  createMockProduct,
  createMockInventory,
} from '../common/test-utils';

describe('InventoryService', () => {
  let service: InventoryService;
  let prismaService: jest.Mocked<PrismaService>;
  let productHelperService: jest.Mocked<ProductHelperService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockProductHelper = {
      validateProductExists: jest.fn(),
      validateProductExistsAndActive: jest.fn(),
      validateProductActive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: ProductHelperService,
          useValue: mockProductHelper,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prismaService = module.get(PrismaService);
    productHelperService = module.get(ProductHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateInventory', () => {
    it('should use ProductHelperService.validateProductExists', async () => {
      const mockProduct = createMockProduct();
      const mockInventory = createMockInventory({ quantity: 50 });

      productHelperService.validateProductExists.mockResolvedValue(
        mockProduct as any,
      );
      prismaService.product.findUnique.mockResolvedValue({
        ...mockProduct,
        inventory: mockInventory,
      } as any);
      prismaService.inventory.update.mockResolvedValue({
        ...mockInventory,
        quantity: 100,
      } as any);

      await service.updateInventory('product-123', 100);

      expect(productHelperService.validateProductExists).toHaveBeenCalledWith(
        'product-123',
      );
    });

    it('should handle inventory creation when it does not exist', async () => {
      const mockProduct = createMockProduct();

      productHelperService.validateProductExists.mockResolvedValue(
        mockProduct as any,
      );
      prismaService.product.findUnique.mockResolvedValue({
        ...mockProduct,
        inventory: null,
      } as any);
      prismaService.inventory.create.mockResolvedValue(
        createMockInventory() as any,
      );

      await service.updateInventory('product-123', 100);

      expect(prismaService.inventory.create).toHaveBeenCalledWith({
        data: {
          productId: 'product-123',
          quantity: 100,
        },
      });
    });
  });
});

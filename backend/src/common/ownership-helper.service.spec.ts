import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { OwnershipHelperService } from './ownership-helper.service';

describe('OwnershipHelperService', () => {
  let service: OwnershipHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnershipHelperService],
    }).compile();

    service = module.get<OwnershipHelperService>(OwnershipHelperService);
  });

  describe('verifyResourceOwnership', () => {
    it('should not throw when resource belongs to user', () => {
      const resource = { userId: 'user-123' };
      const userId = 'user-123';

      expect(() => {
        service.verifyResourceOwnership(resource, userId);
      }).not.toThrow();
    });

    it('should throw ForbiddenException when resource does not belong to user', () => {
      const resource = { userId: 'user-123' };
      const userId = 'different-user-456';

      expect(() => {
        service.verifyResourceOwnership(resource, userId);
      }).toThrow(ForbiddenException);
    });

    it('should use custom resourceName in error message', () => {
      const resource = { userId: 'user-123' };
      const userId = 'different-user-456';

      try {
        service.verifyResourceOwnership(resource, userId, 'address');
        fail('Should have thrown ForbiddenException');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toContain('address');
        expect(error.message).toContain('You can only access your own');
      }
    });

    it('should use default resourceName when not provided', () => {
      const resource = { userId: 'user-123' };
      const userId = 'different-user-456';

      try {
        service.verifyResourceOwnership(resource, userId);
        fail('Should have thrown ForbiddenException');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toContain('resource');
        expect(error.message).toContain('You can only access your own');
      }
    });

    it('should handle different resource types', () => {
      const address = { userId: 'user-123' };
      const cart = { userId: 'user-123' };
      const order = { userId: 'user-123' };
      const userId = 'user-123';

      expect(() => {
        service.verifyResourceOwnership(address, userId, 'address');
        service.verifyResourceOwnership(cart, userId, 'cart');
        service.verifyResourceOwnership(order, userId, 'order');
      }).not.toThrow();
    });
  });
});

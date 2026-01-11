import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockPrisma = {
      $queryRaw: jest.fn(),
    };
    const mockHealthCheck = {
      check: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: HealthCheckService,
          useValue: mockHealthCheck,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

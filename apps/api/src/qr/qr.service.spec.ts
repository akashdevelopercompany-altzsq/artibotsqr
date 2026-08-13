import { Test, TestingModule } from '@nestjs/testing';
import { QrService } from './qr.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

const mockPrismaService = {
  qRCode: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  organizationMember: {
    findFirst: jest.fn(),
  },
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('QrService', () => {
  let service: QrService;
  let prisma: any;
  let redis: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QrService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<QrService>(QrService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a QR code', async () => {
      mockPrismaService.organizationMember.findFirst.mockResolvedValue({ organizationId: 'org1' });
      mockPrismaService.qRCode.findUnique.mockResolvedValue(null); // Shortcode is unique
      
      const createdQr = { id: 'qr1', shortCode: 'abC123' };
      mockPrismaService.qRCode.create.mockResolvedValue(createdQr);

      const dto = { name: 'Test', destinationUrl: 'https://test.com', type: 'WEBSITE' as any };
      const result = await service.create('user1', dto);
      
      expect(result).toEqual(createdQr);
      expect(mockPrismaService.qRCode.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw an error if QR code not found', async () => {
      mockPrismaService.qRCode.findUnique.mockResolvedValue(null);
      await expect(service.findOne('qr1', 'user1')).rejects.toThrow('QR Code not found');
    });

    it('should throw an error if user does not own QR code', async () => {
      mockPrismaService.qRCode.findUnique.mockResolvedValue({ userId: 'other-user' });
      await expect(service.findOne('qr1', 'user1')).rejects.toThrow('Access denied');
    });

    it('should return QR code if found and owned by user', async () => {
      const qr = { id: 'qr1', userId: 'user1' };
      mockPrismaService.qRCode.findUnique.mockResolvedValue(qr);
      const result = await service.findOne('qr1', 'user1');
      expect(result).toEqual(qr);
    });
  });
});

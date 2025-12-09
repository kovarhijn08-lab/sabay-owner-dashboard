import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ManagerService } from "./manager.service";
import { OwnerProperty } from "../database/entities/owner-property.entity";
import { ConstructionUpdate } from "../database/entities/construction-update.entity";
import { Booking } from "../database/entities/booking.entity";
import { Expense } from "../database/entities/expense.entity";
import { Payout } from "../database/entities/payout.entity";
import { Valuation } from "../database/entities/valuation.entity";
import { Document } from "../database/entities/document.entity";
import { PropertyEvent } from "../database/entities/property-event.entity";
import { CreateConstructionUpdateDto } from "./dto/create-construction-update.dto";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { CreateExpenseDto } from "./dto/create-expense.dto";

describe("ManagerService", () => {
  let service: ManagerService;
  let propertyRepository: jest.Mocked<Repository<OwnerProperty>>;
  let constructionUpdateRepository: jest.Mocked<Repository<ConstructionUpdate>>;
  let bookingRepository: jest.Mocked<Repository<Booking>>;
  let expenseRepository: jest.Mocked<Repository<Expense>>;
  let payoutRepository: jest.Mocked<Repository<Payout>>;
  let valuationRepository: jest.Mocked<Repository<Valuation>>;
  let documentRepository: jest.Mocked<Repository<Document>>;
  let eventRepository: jest.Mocked<Repository<PropertyEvent>>;

  const mockProperty: OwnerProperty = {
    id: "property-1",
    managerId: "manager-1",
    ownerId: "owner-1",
    name: "Test Property",
    region: "Test Region",
    status: "under_construction",
    isActive: true,
    purchasePrice: 1000000,
    currentEstimate: 1200000,
    purchaseDate: new Date("2024-01-01"),
    constructionProgress: 50,
    lastConstructionUpdateAt: null,
    lastRentalUpdateAt: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as OwnerProperty;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(),
        getMany: jest.fn(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagerService,
        {
          provide: getRepositoryToken(OwnerProperty),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ConstructionUpdate),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Expense),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Payout),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Valuation),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Document),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(PropertyEvent),
          useValue: mockRepository,
        },
        {
          provide: "DataSource",
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ManagerService>(ManagerService);
    propertyRepository = module.get(getRepositoryToken(OwnerProperty));
    constructionUpdateRepository = module.get(
      getRepositoryToken(ConstructionUpdate),
    );
    bookingRepository = module.get(getRepositoryToken(Booking));
    expenseRepository = module.get(getRepositoryToken(Expense));
    payoutRepository = module.get(getRepositoryToken(Payout));
    valuationRepository = module.get(getRepositoryToken(Valuation));
    documentRepository = module.get(getRepositoryToken(Document));
    eventRepository = module.get(getRepositoryToken(PropertyEvent));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findMyProperties", () => {
    it("should return properties for manager", async () => {
      const managerId = "manager-1";
      propertyRepository.find.mockResolvedValue([mockProperty]);

      const result = await service.findMyProperties(managerId);

      expect(result).toEqual([mockProperty]);
      expect(propertyRepository.find).toHaveBeenCalledWith({
        where: { managerId, deletedAt: null },
        relations: ["owner", "unit", "manager"],
        order: { createdAt: "DESC" },
      });
    });
  });

  describe("getPropertyById", () => {
    it("should return property if manager has access", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      propertyRepository.findOne.mockResolvedValue(mockProperty);

      const result = await service.getPropertyById(propertyId, managerId);

      expect(result).toEqual(mockProperty);
      expect(propertyRepository.findOne).toHaveBeenCalledWith({
        where: { id: propertyId, managerId, deletedAt: null },
        relations: ["owner", "unit", "manager", "managementCompany"],
      });
    });

    it("should throw NotFoundException if property not found", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      propertyRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getPropertyById(propertyId, managerId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("addConstructionUpdate", () => {
    it("should create construction update with valid data", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateConstructionUpdateDto = {
        progress: 60,
        stage: "Foundation",
        description: "Test update",
      };

      propertyRepository.findOne.mockResolvedValue(mockProperty);
      constructionUpdateRepository.findOne.mockResolvedValue(null);
      constructionUpdateRepository.create.mockReturnValue({
        id: "update-1",
        ...dto,
        propertyId,
        createdById: managerId,
      } as ConstructionUpdate);
      constructionUpdateRepository.save.mockResolvedValue({
        id: "update-1",
        ...dto,
        propertyId,
        createdById: managerId,
      } as ConstructionUpdate);
      eventRepository.create.mockReturnValue({} as PropertyEvent);
      eventRepository.save.mockResolvedValue({} as PropertyEvent);

      const result = await service.addConstructionUpdate(
        propertyId,
        dto,
        managerId,
      );

      expect(result).toBeDefined();
      expect(constructionUpdateRepository.create).toHaveBeenCalled();
      expect(constructionUpdateRepository.save).toHaveBeenCalled();
    });

    it("should throw BadRequestException if progress is out of range", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateConstructionUpdateDto = {
        progress: 150,
      };

      propertyRepository.findOne.mockResolvedValue(mockProperty);

      await expect(
        service.addConstructionUpdate(propertyId, dto, managerId),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if progress decreases without reason", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateConstructionUpdateDto = {
        progress: 40,
      };

      const lastUpdate = {
        id: "update-1",
        progress: 50,
        propertyId,
      } as ConstructionUpdate;

      propertyRepository.findOne.mockResolvedValue(mockProperty);
      constructionUpdateRepository.findOne.mockResolvedValue(lastUpdate);

      await expect(
        service.addConstructionUpdate(propertyId, dto, managerId),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if more than 3 photos", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateConstructionUpdateDto = {
        progress: 60,
        photos: ["photo1", "photo2", "photo3", "photo4"],
      };

      propertyRepository.findOne.mockResolvedValue(mockProperty);
      constructionUpdateRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addConstructionUpdate(propertyId, dto, managerId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("addBooking", () => {
    it("should create booking with valid data", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateBookingDto = {
        checkIn: "2024-06-01",
        checkOut: "2024-06-05",
        totalAmount: 50000,
        source: "Airbnb",
      };

      propertyRepository.findOne.mockResolvedValue(mockProperty);
      bookingRepository.createQueryBuilder().getMany.mockResolvedValue([]);
      bookingRepository.create.mockReturnValue({
        id: "booking-1",
        propertyId,
        checkinDate: new Date(dto.checkIn),
        checkoutDate: new Date(dto.checkOut),
        amount: dto.totalAmount,
        source: dto.source,
        createdById: managerId,
      } as Booking);
      bookingRepository.save.mockResolvedValue({
        id: "booking-1",
        propertyId,
        checkinDate: new Date(dto.checkIn),
        checkoutDate: new Date(dto.checkOut),
        amount: dto.totalAmount,
        source: dto.source,
        createdById: managerId,
      } as Booking);
      eventRepository.create.mockReturnValue({} as PropertyEvent);
      eventRepository.save.mockResolvedValue({} as PropertyEvent);

      const result = await service.addBooking(propertyId, dto, managerId);

      expect(result).toBeDefined();
      expect(bookingRepository.create).toHaveBeenCalled();
      expect(bookingRepository.save).toHaveBeenCalled();
    });

    it("should throw BadRequestException if checkout date is before checkin", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateBookingDto = {
        checkIn: "2024-06-05",
        checkOut: "2024-06-01",
        totalAmount: 50000,
        source: "Airbnb",
      };

      propertyRepository.findOne.mockResolvedValue(mockProperty);

      await expect(
        service.addBooking(propertyId, dto, managerId),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if booking dates overlap", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateBookingDto = {
        checkIn: "2024-06-01",
        checkOut: "2024-06-05",
        totalAmount: 50000,
        source: "Airbnb",
      };

      const existingBooking = {
        id: "booking-1",
        checkinDate: new Date("2024-06-03"),
        checkoutDate: new Date("2024-06-07"),
        source: "Booking.com",
        amount: 60000,
      } as Booking;

      propertyRepository.findOne.mockResolvedValue(mockProperty);
      bookingRepository
        .createQueryBuilder()
        .getMany.mockResolvedValue([existingBooking]);

      await expect(
        service.addBooking(propertyId, dto, managerId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("addExpense", () => {
    it("should create expense with valid data", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateExpenseDto = {
        amount: 5000,
        expenseType: "Cleaning",
        expenseDate: "2024-06-01",
        description: "Monthly cleaning",
      };

      propertyRepository.findOne.mockResolvedValue(mockProperty);
      expenseRepository.create.mockReturnValue({
        id: "expense-1",
        propertyId,
        amount: dto.amount,
        expenseType: dto.expenseType,
        expenseDate: new Date(dto.expenseDate),
        createdById: managerId,
      } as Expense);
      expenseRepository.save.mockResolvedValue({
        id: "expense-1",
        propertyId,
        amount: dto.amount,
        expenseType: dto.expenseType,
        expenseDate: new Date(dto.expenseDate),
        createdById: managerId,
      } as Expense);
      eventRepository.create.mockReturnValue({} as PropertyEvent);
      eventRepository.save.mockResolvedValue({} as PropertyEvent);

      const result = await service.addExpense(propertyId, dto, managerId);

      expect(result).toBeDefined();
      expect(expenseRepository.create).toHaveBeenCalled();
      expect(expenseRepository.save).toHaveBeenCalled();
    });

    it("should throw BadRequestException if amount is zero or negative", async () => {
      const propertyId = "property-1";
      const managerId = "manager-1";
      const dto: CreateExpenseDto = {
        amount: 0,
        expenseType: "Cleaning",
        expenseDate: "2024-06-01",
      };

      propertyRepository.findOne.mockResolvedValue(mockProperty);

      await expect(
        service.addExpense(propertyId, dto, managerId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("ensureManagerAccess", () => {
    it("should throw ForbiddenException if manager does not have access", async () => {
      const propertyId = "property-1";
      const managerId = "wrong-manager";
      propertyRepository.findOne.mockResolvedValue(null);

      await expect(
        (service as any).ensureManagerAccess(propertyId, managerId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

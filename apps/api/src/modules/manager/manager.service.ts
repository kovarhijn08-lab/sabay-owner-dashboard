import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { OwnerProperty } from "../database/entities/owner-property.entity";
import { ConstructionUpdate } from "../database/entities/construction-update.entity";
import { Booking } from "../database/entities/booking.entity";
import { Expense } from "../database/entities/expense.entity";
import { Payout } from "../database/entities/payout.entity";
import { Valuation } from "../database/entities/valuation.entity";
import { Document } from "../database/entities/document.entity";
import { PropertyEvent } from "../database/entities/property-event.entity";
import { CreateConstructionUpdateDto } from "./dto/create-construction-update.dto";
import { UpdateConstructionUpdateDto } from "./dto/update-construction-update.dto";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { CreatePayoutDto } from "./dto/create-payout.dto";
import { UpdatePayoutDto } from "./dto/update-payout.dto";
import { CreateValuationDto } from "./dto/create-valuation.dto";
import { UpdateValuationDto } from "./dto/update-valuation.dto";
import { UploadDocumentDto } from "./dto/upload-document.dto";

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(OwnerProperty)
    private propertyRepository: Repository<OwnerProperty>,
    @InjectRepository(ConstructionUpdate)
    private constructionUpdateRepository: Repository<ConstructionUpdate>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Payout)
    private payoutRepository: Repository<Payout>,
    @InjectRepository(Valuation)
    private valuationRepository: Repository<Valuation>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(PropertyEvent)
    private eventRepository: Repository<PropertyEvent>,
    private dataSource: DataSource,
  ) {}

  async findMyProperties(managerId: string) {
    return this.propertyRepository.find({
      where: { managerId, deletedAt: null },
      relations: ["owner", "unit", "manager"],
      order: { createdAt: "DESC" },
    });
  }

  async getPropertyById(propertyId: string, managerId: string) {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId, managerId, deletedAt: null },
      relations: ["owner", "unit", "manager", "managementCompany"],
    });

    if (!property) {
      throw new NotFoundException("Объект не найден или у вас нет доступа");
    }

    return property;
  }

  // ========== Construction Updates ==========

  async getConstructionUpdates(propertyId: string, managerId: string) {
    await this.ensureManagerAccess(propertyId, managerId);
    return this.constructionUpdateRepository.find({
      where: { propertyId },
      relations: ["createdBy"],
      order: { updateDate: "DESC", createdAt: "DESC" },
    });
  }

  async addConstructionUpdate(
    propertyId: string,
    dto: CreateConstructionUpdateDto,
    managerId: string,
    reasonForDecrease?: string,
  ) {
    const property = await this.ensureManagerAccess(propertyId, managerId);

    // Проверка уменьшения прогресса (нужно получить последнее обновление заранее)
    let lastUpdate: ConstructionUpdate | null = null;
    if (dto.progress !== undefined) {
      lastUpdate = await this.constructionUpdateRepository.findOne({
        where: { propertyId },
        order: { updateDate: "DESC", createdAt: "DESC" },
      });
    }

    // Валидация прогресса
    if (dto.progress !== undefined) {
      if (dto.progress < 0 || dto.progress > 100) {
        throw new BadRequestException("Прогресс должен быть от 0 до 100");
      }

      if (
        lastUpdate &&
        lastUpdate.progress !== null &&
        dto.progress < lastUpdate.progress
      ) {
        if (!reasonForDecrease || reasonForDecrease.trim().length < 10) {
          throw new BadRequestException(
            "При уменьшении прогресса требуется указать причину (минимум 10 символов)",
          );
        }
      }
    }

    // Валидация фото
    if (dto.photos && dto.photos.length > 3) {
      throw new BadRequestException(
        "Максимум 3 фотографии на одно обновление стройки",
      );
    }

    const update = this.constructionUpdateRepository.create({
      propertyId,
      progress: dto.progress ?? null,
      stage: dto.stage ?? null,
      updateDate: dto.updateDate ? new Date(dto.updateDate) : new Date(),
      description: dto.description ?? null,
      photos: dto.photos ?? [],
      createdById: managerId,
    });

    const saved = await this.constructionUpdateRepository.save(update);

    // Пересчёт lastConstructionUpdateAt
    await this.recalculateLastConstructionUpdateAt(propertyId);

    // Создание события
    await this.createEvent(propertyId, managerId, "construction_update_added", {
      updateId: saved.id,
      progress: saved.progress,
      stage: saved.stage,
    });

    // Если прогресс уменьшился, создаём специальное событие
    if (
      lastUpdate &&
      lastUpdate.progress !== null &&
      saved.progress !== null &&
      saved.progress < lastUpdate.progress
    ) {
      await this.createEvent(
        propertyId,
        managerId,
        "construction_progress_decreased",
        {
          oldProgress: lastUpdate.progress,
          newProgress: saved.progress,
          reason: reasonForDecrease,
        },
      );
    }

    return saved;
  }

  async updateConstructionUpdate(
    updateId: string,
    dto: UpdateConstructionUpdateDto,
    managerId: string,
    reasonForDecrease?: string,
  ) {
    const update = await this.constructionUpdateRepository.findOne({
      where: { id: updateId },
      relations: ["property"],
    });

    if (!update) {
      throw new NotFoundException("Обновление не найдено");
    }

    await this.ensureManagerAccess(update.propertyId, managerId);

    // Валидация прогресса
    if (dto.progress !== undefined) {
      if (dto.progress < 0 || dto.progress > 100) {
        throw new BadRequestException("Прогресс должен быть от 0 до 100");
      }

      if (update.progress !== null && dto.progress < update.progress) {
        if (!reasonForDecrease || reasonForDecrease.trim().length < 10) {
          throw new BadRequestException(
            "При уменьшении прогресса требуется указать причину (минимум 10 символов)",
          );
        }
      }
    }

    // Валидация фото
    if (dto.photos && dto.photos.length > 3) {
      throw new BadRequestException(
        "Максимум 3 фотографии на одно обновление стройки",
      );
    }

    const oldProgress = update.progress;
    Object.assign(update, dto);
    if (dto.updateDate) update.updateDate = new Date(dto.updateDate);
    if (dto.photos) update.photos = dto.photos;
    if (dto.progress !== undefined) update.progress = dto.progress;
    if (dto.stage !== undefined) update.stage = dto.stage;
    if (dto.description !== undefined) update.description = dto.description;

    const saved = await this.constructionUpdateRepository.save(update);

    await this.recalculateLastConstructionUpdateAt(update.propertyId);

    await this.createEvent(
      update.propertyId,
      managerId,
      "construction_update_added",
      {
        updateId: saved.id,
        progress: saved.progress,
        stage: saved.stage,
      },
    );

    if (
      oldProgress !== null &&
      saved.progress !== null &&
      saved.progress < oldProgress
    ) {
      await this.createEvent(
        update.propertyId,
        managerId,
        "construction_progress_decreased",
        {
          oldProgress,
          newProgress: saved.progress,
          reason: reasonForDecrease,
        },
      );
    }

    return saved;
  }

  async deleteConstructionUpdate(updateId: string, managerId: string) {
    const update = await this.constructionUpdateRepository.findOne({
      where: { id: updateId },
      relations: ["property"],
    });

    if (!update) {
      throw new NotFoundException("Обновление не найдено");
    }

    await this.ensureManagerAccess(update.propertyId, managerId);

    update.deletedAt = new Date();
    await this.constructionUpdateRepository.save(update);

    await this.recalculateLastConstructionUpdateAt(update.propertyId);

    return { message: "Обновление удалено" };
  }

  // ========== Bookings ==========

  async getBookings(propertyId: string, managerId: string) {
    await this.ensureManagerAccess(propertyId, managerId);
    return this.bookingRepository.find({
      where: { propertyId, deletedAt: null },
      relations: ["createdBy"],
      order: { checkinDate: "DESC" },
    });
  }

  async addBooking(
    propertyId: string,
    dto: CreateBookingDto,
    managerId: string,
  ) {
    await this.ensureManagerAccess(propertyId, managerId);

    const checkin = new Date(dto.checkIn);
    const checkout = new Date(dto.checkOut);

    if (checkout <= checkin) {
      throw new BadRequestException(
        "Дата выезда должна быть позже даты заезда",
      );
    }

    if (dto.totalAmount <= 0) {
      throw new BadRequestException("Сумма должна быть больше 0");
    }

    // Проверка пересечения дат
    const overlapping = await this.bookingRepository
      .createQueryBuilder("booking")
      .where("booking.propertyId = :propertyId", { propertyId })
      .andWhere("booking.deletedAt IS NULL")
      .andWhere(
        "NOT (booking.checkoutDate <= :checkin OR booking.checkinDate >= :checkout)",
        { checkin, checkout },
      )
      .getMany();

    if (overlapping.length > 0) {
      const conflicts = overlapping.map((b) => ({
        dates: `${b.checkinDate.toISOString().split("T")[0]} - ${b.checkoutDate.toISOString().split("T")[0]}`,
        source: b.source,
        amount: b.amount,
      }));
      throw new BadRequestException(
        `Конфликт бронирований. Новая бронь пересекается с существующими: ${JSON.stringify(conflicts)}`,
      );
    }

    const booking = this.bookingRepository.create({
      propertyId,
      checkinDate: checkin,
      checkoutDate: checkout,
      source: dto.source,
      amount: dto.totalAmount,
      comment: dto.description ?? null,
      guestName: dto.guestName ?? null,
      createdById: managerId,
    });

    const saved = await this.bookingRepository.save(booking);

    await this.recalculateLastRentalUpdateAt(propertyId);

    await this.createEvent(propertyId, managerId, "booking_added", {
      bookingId: saved.id,
      checkinDate: saved.checkinDate,
      checkoutDate: saved.checkoutDate,
      amount: saved.amount,
    });

    return saved;
  }

  async updateBooking(
    bookingId: string,
    dto: UpdateBookingDto,
    managerId: string,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ["property"],
    });

    if (!booking) {
      throw new NotFoundException("Бронирование не найдено");
    }

    await this.ensureManagerAccess(booking.propertyId, managerId);

    const checkin = dto.checkIn ? new Date(dto.checkIn) : booking.checkinDate;
    const checkout = dto.checkOut
      ? new Date(dto.checkOut)
      : booking.checkoutDate;

    if (checkout <= checkin) {
      throw new BadRequestException(
        "Дата выезда должна быть позже даты заезда",
      );
    }

    if (dto.totalAmount !== undefined && dto.totalAmount <= 0) {
      throw new BadRequestException("Сумма должна быть больше 0");
    }

    // Проверка пересечения с остальными бронированиями
    const overlapping = await this.bookingRepository
      .createQueryBuilder("b")
      .where("b.propertyId = :propertyId", { propertyId: booking.propertyId })
      .andWhere("b.id != :bookingId", { bookingId })
      .andWhere("b.deletedAt IS NULL")
      .andWhere(
        "NOT (b.checkoutDate <= :checkin OR b.checkinDate >= :checkout)",
        {
          checkin,
          checkout,
        },
      )
      .getMany();

    if (overlapping.length > 0) {
      throw new BadRequestException(
        "Конфликт бронирований с существующими записями",
      );
    }

    Object.assign(booking, dto);
    if (dto.checkIn) booking.checkinDate = checkin;
    if (dto.checkOut) booking.checkoutDate = checkout;
    if (dto.totalAmount !== undefined) booking.amount = dto.totalAmount;
    if (dto.description !== undefined) booking.comment = dto.description;
    if (dto.guestName !== undefined) booking.guestName = dto.guestName;

    const saved = await this.bookingRepository.save(booking);

    await this.recalculateLastRentalUpdateAt(booking.propertyId);

    await this.createEvent(booking.propertyId, managerId, "booking_updated", {
      bookingId: saved.id,
      checkinDate: saved.checkinDate,
      checkoutDate: saved.checkoutDate,
    });

    return saved;
  }

  async deleteBooking(bookingId: string, managerId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ["property"],
    });

    if (!booking) {
      throw new NotFoundException("Бронирование не найдено");
    }

    await this.ensureManagerAccess(booking.propertyId, managerId);

    booking.deletedAt = new Date();
    await this.bookingRepository.save(booking);

    await this.recalculateLastRentalUpdateAt(booking.propertyId);

    await this.createEvent(booking.propertyId, managerId, "booking_deleted", {
      bookingId: booking.id,
    });

    return { message: "Бронирование удалено" };
  }

  // ========== Expenses ==========

  async getExpenses(propertyId: string, managerId: string) {
    await this.ensureManagerAccess(propertyId, managerId);
    return this.expenseRepository.find({
      where: { propertyId, deletedAt: null },
      relations: ["createdBy"],
      order: { expenseDate: "DESC" },
    });
  }

  async addExpense(
    propertyId: string,
    dto: CreateExpenseDto,
    managerId: string,
  ) {
    await this.ensureManagerAccess(propertyId, managerId);

    if (dto.amount <= 0) {
      throw new BadRequestException("Сумма должна быть больше 0");
    }

    const expense = this.expenseRepository.create({
      propertyId,
      expenseDate: new Date(dto.expenseDate),
      expenseType: dto.expenseType,
      amount: dto.amount,
      description: dto.description ?? null,
      createdById: managerId,
    });

    const saved = await this.expenseRepository.save(expense);

    await this.recalculateLastRentalUpdateAt(propertyId);

    await this.createEvent(propertyId, managerId, "expense_added", {
      expenseId: saved.id,
      expenseType: saved.expenseType,
      amount: saved.amount,
    });

    return saved;
  }

  async updateExpense(
    expenseId: string,
    dto: UpdateExpenseDto,
    managerId: string,
  ) {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ["property"],
    });

    if (!expense) {
      throw new NotFoundException("Расход не найден");
    }

    await this.ensureManagerAccess(expense.propertyId, managerId);

    if (dto.amount !== undefined && dto.amount <= 0) {
      throw new BadRequestException("Сумма должна быть больше 0");
    }

    Object.assign(expense, dto);
    if (dto.expenseDate) expense.expenseDate = new Date(dto.expenseDate);

    const saved = await this.expenseRepository.save(expense);

    await this.recalculateLastRentalUpdateAt(expense.propertyId);

    await this.createEvent(expense.propertyId, managerId, "expense_updated", {
      expenseId: saved.id,
    });

    return saved;
  }

  async deleteExpense(expenseId: string, managerId: string) {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ["property"],
    });

    if (!expense) {
      throw new NotFoundException("Расход не найден");
    }

    await this.ensureManagerAccess(expense.propertyId, managerId);

    expense.deletedAt = new Date();
    await this.expenseRepository.save(expense);

    await this.recalculateLastRentalUpdateAt(expense.propertyId);

    await this.createEvent(expense.propertyId, managerId, "expense_deleted", {
      expenseId: expense.id,
    });

    return { message: "Расход удалён" };
  }

  // ========== Payouts ==========

  async getPayouts(propertyId: string, managerId: string) {
    await this.ensureManagerAccess(propertyId, managerId);
    return this.payoutRepository.find({
      where: { propertyId, deletedAt: null },
      relations: ["createdBy"],
      order: { periodTo: "DESC" },
    });
  }

  async createPayout(
    propertyId: string,
    dto: CreatePayoutDto,
    managerId: string,
  ) {
    await this.ensureManagerAccess(propertyId, managerId);

    const periodFrom = new Date(dto.payoutDate);
    const periodTo = new Date(dto.payoutDate);

    if (dto.amount <= 0) {
      throw new BadRequestException("Сумма должна быть больше 0");
    }

    const payout = this.payoutRepository.create({
      propertyId,
      periodFrom,
      periodTo,
      amount: dto.amount,
      status: "planned",
      payoutDate: dto.payoutDate ? new Date(dto.payoutDate) : null,
      paymentMethod: dto.paymentMethod ?? null,
      description: dto.description ?? null,
      createdById: managerId,
    });

    const saved = await this.payoutRepository.save(payout);

    await this.recalculateLastRentalUpdateAt(propertyId);

    await this.createEvent(propertyId, managerId, "payout_created", {
      payoutId: saved.id,
      amount: saved.amount,
      periodFrom: saved.periodFrom,
      periodTo: saved.periodTo,
    });

    return saved;
  }

  async updatePayout(
    payoutId: string,
    dto: UpdatePayoutDto,
    managerId: string,
  ) {
    const payout = await this.payoutRepository.findOne({
      where: { id: payoutId },
      relations: ["property"],
    });

    if (!payout) {
      throw new NotFoundException("Выплата не найдена");
    }

    await this.ensureManagerAccess(payout.propertyId, managerId);

    if (dto.amount !== undefined && dto.amount <= 0) {
      throw new BadRequestException("Сумма должна быть больше 0");
    }

    Object.assign(payout, dto);
    if (dto.payoutDate) payout.payoutDate = new Date(dto.payoutDate);

    const saved = await this.payoutRepository.save(payout);

    await this.recalculateLastRentalUpdateAt(payout.propertyId);

    await this.createEvent(payout.propertyId, managerId, "payout_updated", {
      payoutId: saved.id,
    });

    return saved;
  }

  async deletePayout(payoutId: string, managerId: string) {
    const payout = await this.payoutRepository.findOne({
      where: { id: payoutId },
      relations: ["property"],
    });

    if (!payout) {
      throw new NotFoundException("Выплата не найдена");
    }

    await this.ensureManagerAccess(payout.propertyId, managerId);

    payout.deletedAt = new Date();
    await this.payoutRepository.save(payout);

    await this.recalculateLastRentalUpdateAt(payout.propertyId);

    await this.createEvent(payout.propertyId, managerId, "payout_deleted", {
      payoutId: payout.id,
    });

    return { message: "Выплата удалена" };
  }

  // ========== Valuations ==========

  async getValuations(propertyId: string, managerId: string) {
    await this.ensureManagerAccess(propertyId, managerId);
    return this.valuationRepository.find({
      where: { propertyId, deletedAt: null },
      relations: ["createdBy"],
      order: { valuationDate: "DESC" },
    });
  }

  async addValuation(
    propertyId: string,
    dto: CreateValuationDto,
    managerId: string,
  ) {
    await this.ensureManagerAccess(propertyId, managerId);

    if (dto.value <= 0) {
      throw new BadRequestException("Оценка должна быть больше 0");
    }

    const valuation = this.valuationRepository.create({
      propertyId,
      value: dto.value,
      valuationDate: new Date(dto.valuationDate),
      source: dto.source ?? null,
      notes: dto.notes ?? null,
      createdById: managerId,
    });

    const saved = await this.valuationRepository.save(valuation);

    // Обновляем currentEstimate объекта
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });
    if (property) {
      property.currentEstimate = saved.value;
      await this.propertyRepository.save(property);
    }

    await this.createEvent(propertyId, managerId, "valuation_added", {
      valuationId: saved.id,
      value: saved.value,
    });

    return saved;
  }

  async updateValuation(
    valuationId: string,
    dto: UpdateValuationDto,
    managerId: string,
  ) {
    const valuation = await this.valuationRepository.findOne({
      where: { id: valuationId },
      relations: ["property"],
    });

    if (!valuation) {
      throw new NotFoundException("Оценка не найдена");
    }

    await this.ensureManagerAccess(valuation.propertyId, managerId);

    if (dto.value !== undefined && dto.value <= 0) {
      throw new BadRequestException("Оценка должна быть больше 0");
    }

    Object.assign(valuation, dto);
    if (dto.valuationDate)
      valuation.valuationDate = new Date(dto.valuationDate);

    const saved = await this.valuationRepository.save(valuation);

    await this.createEvent(
      valuation.propertyId,
      managerId,
      "valuation_updated",
      {
        valuationId: saved.id,
      },
    );

    return saved;
  }

  // ========== Documents ==========

  async getDocuments(propertyId: string, managerId: string) {
    await this.ensureManagerAccess(propertyId, managerId);
    return this.documentRepository.find({
      where: { propertyId, deletedAt: null },
      relations: ["uploadedBy"],
      order: { type: "ASC", version: "DESC" },
    });
  }

  async uploadDocument(
    propertyId: string,
    dto: UploadDocumentDto,
    managerId: string,
  ) {
    await this.ensureManagerAccess(propertyId, managerId);

    // Находим максимальную версию для данного типа
    const maxVersion = await this.documentRepository
      .createQueryBuilder("doc")
      .where("doc.propertyId = :propertyId", { propertyId })
      .andWhere("doc.type = :type", { type: dto.documentType })
      .andWhere("doc.deletedAt IS NULL")
      .select("MAX(doc.version)", "maxVersion")
      .getRawOne();

    const nextVersion = maxVersion?.maxVersion ? maxVersion.maxVersion + 1 : 1;

    const document = this.documentRepository.create({
      propertyId,
      type: dto.documentType,
      fileName: dto.fileName,
      fileUrl: dto.fileUrl,
      version: nextVersion,
      description: dto.description ?? null,
      uploadedById: managerId,
    });

    const saved = await this.documentRepository.save(document);

    await this.createEvent(propertyId, managerId, "document_uploaded", {
      documentId: saved.id,
      type: saved.type,
      version: saved.version,
      fileName: saved.fileName,
    });

    return saved;
  }

  async deleteDocument(documentId: string, managerId: string) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, deletedAt: null },
      relations: ["property"],
    });

    if (!document) {
      throw new NotFoundException("Документ не найден");
    }

    await this.ensureManagerAccess(document.propertyId, managerId);

    document.deletedAt = new Date();
    await this.documentRepository.save(document);

    await this.createEvent(document.propertyId, managerId, "document_deleted", {
      documentId: document.id,
      type: document.type,
      version: document.version,
      fileName: document.fileName,
    });

    return { message: "Документ удалён" };
  }

  // ========== Events ==========

  async getPropertyEvents(
    propertyId: string,
    managerId: string,
    limit: number = 50,
  ) {
    await this.ensureManagerAccess(propertyId, managerId);
    return this.eventRepository.find({
      where: { propertyId },
      relations: ["createdBy"],
      order: { createdAt: "DESC" },
      take: limit,
    });
  }

  // ========== Helper Methods ==========

  private async ensureManagerAccess(
    propertyId: string,
    managerId: string,
  ): Promise<OwnerProperty> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId, managerId, deletedAt: null },
    });

    if (!property) {
      throw new ForbiddenException("У вас нет доступа к этому объекту");
    }

    return property;
  }

  private async createEvent(
    propertyId: string,
    userId: string,
    changeType: PropertyEvent["changeType"],
    metadata?: Record<string, any>,
  ) {
    const event = this.eventRepository.create({
      propertyId,
      createdById: userId,
      changeType,
      metadata: metadata || null,
    });
    return this.eventRepository.save(event);
  }

  async recalculateLastConstructionUpdateAt(propertyId: string) {
    const maxDate = await this.constructionUpdateRepository
      .createQueryBuilder("update")
      .where("update.propertyId = :propertyId", { propertyId })
      .andWhere("update.deletedAt IS NULL")
      .select("MAX(update.updateDate)", "maxDate")
      .getRawOne();

    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });
    if (property) {
      property.lastConstructionUpdateAt = maxDate?.maxDate
        ? new Date(maxDate.maxDate)
        : null;
      await this.propertyRepository.save(property);
    }
  }

  async recalculateLastRentalUpdateAt(propertyId: string) {
    // Находим максимум по датам: Booking.checkoutDate, Expense.expenseDate, Payout.periodTo
    const bookingMax = await this.bookingRepository
      .createQueryBuilder("booking")
      .where("booking.propertyId = :propertyId", { propertyId })
      .andWhere("booking.deletedAt IS NULL")
      .select("MAX(booking.checkoutDate)", "maxDate")
      .getRawOne();

    const expenseMax = await this.expenseRepository
      .createQueryBuilder("expense")
      .where("expense.propertyId = :propertyId", { propertyId })
      .andWhere("expense.deletedAt IS NULL")
      .select("MAX(expense.expenseDate)", "maxDate")
      .getRawOne();

    const payoutMax = await this.payoutRepository
      .createQueryBuilder("payout")
      .where("payout.propertyId = :propertyId", { propertyId })
      .andWhere("payout.deletedAt IS NULL")
      .select("MAX(payout.periodTo)", "maxDate")
      .getRawOne();

    const dates = [
      bookingMax?.maxDate ? new Date(bookingMax.maxDate) : null,
      expenseMax?.maxDate ? new Date(expenseMax.maxDate) : null,
      payoutMax?.maxDate ? new Date(payoutMax.maxDate) : null,
    ].filter((d) => d !== null) as Date[];

    const maxDate =
      dates.length > 0
        ? new Date(Math.max(...dates.map((d) => d.getTime())))
        : null;

    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });
    if (property) {
      property.lastRentalUpdateAt = maxDate;
      await this.propertyRepository.save(property);
    }
  }
}

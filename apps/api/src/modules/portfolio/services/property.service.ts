import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OwnerProperty } from "../../database/entities/owner-property.entity";
import { Project } from "../../database/entities/project.entity";
import { Unit } from "../../database/entities/unit.entity";
import { PropertyEvent } from "../../database/entities/property-event.entity";
import { CreatePropertyDto } from "../dto/create-property.dto";
import { UpdatePropertyDto } from "../dto/update-property.dto";

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(OwnerProperty)
    private propertyRepository: Repository<OwnerProperty>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    @InjectRepository(PropertyEvent)
    private eventRepository: Repository<PropertyEvent>,
  ) {}

  async findById(id: string, userId: string) {
    return this.propertyRepository.findOne({
      where: { id, ownerId: userId, deletedAt: null },
      relations: ["owner", "manager", "unit", "managementCompany"],
    });
  }

  async findAll(userId: string) {
    return this.propertyRepository.find({
      where: { ownerId: userId, deletedAt: null },
      relations: ["owner", "manager", "unit"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Создает новый объект OwnerProperty с логикой назначения менеджера:
   * 1. Если в запросе указан managerId - используем его
   * 2. Иначе, если у связанного Project есть defaultManagerId - используем его
   * 3. Иначе managerId = null
   *
   * Также создает или находит Unit по unitNumber:
   * - Если указан projectId, ищет Unit с таким unitNumber в проекте
   * - Если не найден, создает новый Unit
   * - Если projectId не указан, создает Unit без проекта
   */
  async create(ownerId: string, createDto: CreatePropertyDto) {
    let managerId: string | null = null;
    let unitId: string | null = null;

    // Логика назначения менеджера
    if (createDto.managerId) {
      // 1. Если в запросе явно указан managerId - используем его
      managerId = createDto.managerId;
    } else if (createDto.projectId) {
      // 2. Иначе, если указан projectId, проверяем defaultManagerId проекта
      const project = await this.projectRepository.findOne({
        where: { id: createDto.projectId, deletedAt: null },
      });
      if (project?.defaultManagerId) {
        managerId = project.defaultManagerId;
      }
    }
    // 3. Если ни того, ни другого нет - managerId остается null

    // Логика создания/поиска Unit по unitNumber
    if (createDto.unitNumber) {
      // Если указан projectId, ищем Unit в проекте
      if (createDto.projectId) {
        // Используем raw query для поиска Unit, чтобы избежать проблем с отсутствующими полями
        let unit = null;
        try {
          unit = await this.unitRepository
            .createQueryBuilder("unit")
            .where("unit.projectId = :projectId", {
              projectId: createDto.projectId,
            })
            .andWhere("unit.unitNumber = :unitNumber", {
              unitNumber: createDto.unitNumber,
            })
            .andWhere('(unit.deletedAt IS NULL OR unit.deletedAt = "")')
            .select(["unit.id", "unit.projectId", "unit.unitNumber"])
            .getOne();
        } catch (error) {
          console.error("[PropertyService] Ошибка поиска Unit:", error);
          // Продолжаем создание нового Unit
        }

        // Если не найден, создаем новый Unit
        if (!unit) {
          unit = this.unitRepository.create({
            projectId: createDto.projectId,
            unitNumber: createDto.unitNumber,
          });
          unit = await this.unitRepository.save(unit);
        }

        unitId = unit.id;
      } else {
        // Если projectId не указан, создаем Unit без проекта
        const unit = this.unitRepository.create({
          projectId: null,
          unitNumber: createDto.unitNumber,
        });
        const savedUnit = await this.unitRepository.save(unit);
        unitId = savedUnit.id;
      }
    } else if (createDto.unitId) {
      // Если указан unitId напрямую, используем его
      unitId = createDto.unitId;
    }

    // Удаляем unitNumber из DTO перед созданием property (это поле не в OwnerProperty)
    const { unitNumber, ...propertyData } = createDto;

    const property = this.propertyRepository.create({
      ...propertyData,
      unitId,
      ownerId,
      managerId,
      status: "under_construction",
      isActive: true,
    });

    return this.propertyRepository.save(property);
  }

  async update(id: string, userId: string, updateDto: UpdatePropertyDto) {
    const property = await this.findById(id, userId);
    if (!property) {
      throw new NotFoundException("Объект не найден");
    }

    Object.assign(property, updateDto);
    return this.propertyRepository.save(property);
  }

  async getProperty(id: string, userId: string) {
    return this.findById(id, userId);
  }

  /**
   * Получить историю изменений объекта
   */
  async getPropertyHistory(
    propertyId: string,
    userId: string,
    limit: number = 50,
  ) {
    // Проверяем, что объект принадлежит пользователю
    const property = await this.findById(propertyId, userId);
    if (!property) {
      throw new NotFoundException("Объект не найден");
    }

    return this.eventRepository.find({
      where: { propertyId },
      relations: ["createdBy"],
      order: { createdAt: "DESC" },
      take: limit,
    });
  }

  /**
   * Получить расширенную аналитику объекта (IRR, Payback Period и др.)
   */
  async getPropertyAnalytics(propertyId: string, userId: string) {
    const property = await this.findById(propertyId, userId);
    if (!property) {
      throw new NotFoundException("Объект не найден");
    }

    const purchasePrice = property.purchasePrice || 0;
    const currentValue = property.currentEstimate || purchasePrice;
    const purchaseDate = property.purchaseDate
      ? new Date(property.purchaseDate)
      : new Date(property.createdAt);
    const now = new Date();

    // ROI (уже рассчитывается на фронтенде, но добавим для полноты)
    const roi =
      purchasePrice > 0
        ? ((currentValue - purchasePrice) / purchasePrice) * 100
        : 0;

    // Payback Period (период окупаемости)
    // Упрощенный расчет: если есть ожидаемый доход, рассчитываем через него
    let paybackPeriodYears: number | null = null;
    if (
      property.expectedAdr &&
      property.expectedOccupancy &&
      property.status === "rental"
    ) {
      const annualIncome =
        property.expectedAdr * (property.expectedOccupancy / 100) * 365;
      if (annualIncome > 0) {
        paybackPeriodYears = purchasePrice / annualIncome;
      }
    }

    // IRR (Internal Rate of Return) - упрощенный расчет
    // Для точного IRR нужны все денежные потоки, здесь упрощенная версия
    let irr: number | null = null;
    if (purchasePrice > 0 && currentValue > 0) {
      const daysHeld =
        (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
      const yearsHeld = daysHeld / 365;

      // Рассчитываем только если объект в собственности более 7 дней (чтобы избежать экстремальных значений)
      if (daysHeld >= 7 && yearsHeld < 100) {
        const ratio = currentValue / purchasePrice;
        // Ограничиваем разумный диапазон роста (от 0.1x до 10x)
        if (ratio >= 0.1 && ratio <= 10) {
          const annualizedReturn = Math.pow(ratio, 1 / yearsHeld) - 1;
          // Ограничиваем разумный диапазон годовой доходности (от -90% до 500%)
          if (annualizedReturn >= -0.9 && annualizedReturn <= 5) {
            irr = annualizedReturn * 100;
          }
        }
      }
    }

    // CAGR (Compound Annual Growth Rate) - аналогично IRR
    let cagr: number | null = null;
    if (purchasePrice > 0 && currentValue > 0) {
      const daysHeld =
        (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
      const yearsHeld = daysHeld / 365;

      // Рассчитываем только если объект в собственности более 7 дней
      if (daysHeld >= 7 && yearsHeld < 100) {
        const ratio = currentValue / purchasePrice;
        if (ratio >= 0.1 && ratio <= 10) {
          const annualizedReturn = Math.pow(ratio, 1 / yearsHeld) - 1;
          if (annualizedReturn >= -0.9 && annualizedReturn <= 5) {
            cagr = annualizedReturn * 100;
          }
        }
      }
    }

    // Прогноз годового дохода
    let forecastAnnualIncome: number | null = null;
    if (property.expectedAdr && property.expectedOccupancy) {
      forecastAnnualIncome =
        property.expectedAdr * (property.expectedOccupancy / 100) * 365;
    }

    // Yield (доходность)
    let yieldPercent: number | null = null;
    if (forecastAnnualIncome && currentValue > 0) {
      yieldPercent = (forecastAnnualIncome / currentValue) * 100;
    }

    // Форматирование значений с проверкой на разумность
    const formatPercent = (
      value: number | null,
      maxValue: number = 1000,
    ): number | null => {
      if (value === null || isNaN(value) || !isFinite(value)) return null;
      if (Math.abs(value) > maxValue) return null; // Слишком большое значение
      return Math.round(value * 100) / 100;
    };

    return {
      roi: formatPercent(roi, 1000),
      paybackPeriodYears:
        paybackPeriodYears && paybackPeriodYears > 0 && paybackPeriodYears < 100
          ? Math.round(paybackPeriodYears * 10) / 10
          : null,
      irr: formatPercent(irr, 1000),
      cagr: formatPercent(cagr, 1000),
      forecastAnnualIncome:
        forecastAnnualIncome &&
        forecastAnnualIncome > 0 &&
        forecastAnnualIncome < 1e15
          ? Math.round(forecastAnnualIncome)
          : null,
      yieldPercent: formatPercent(yieldPercent, 100),
    };
  }
}

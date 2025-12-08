import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerProperty } from '../../database/entities/owner-property.entity';
import { Project } from '../../database/entities/project.entity';
import { Unit } from '../../database/entities/unit.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(OwnerProperty)
    private propertyRepository: Repository<OwnerProperty>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  async findById(id: string, userId: string) {
    return this.propertyRepository.findOne({
      where: { id, ownerId: userId, deletedAt: null },
      relations: ['owner', 'manager', 'unit', 'managementCompany'],
    });
  }

  async findAll(userId: string) {
    return this.propertyRepository.find({
      where: { ownerId: userId, deletedAt: null },
      relations: ['owner', 'manager', 'unit', 'managementCompany'],
      order: { createdAt: 'DESC' },
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
        const unitResult = await this.unitRepository
          .createQueryBuilder('unit')
          .where('unit.projectId = :projectId', { projectId: createDto.projectId })
          .andWhere('unit.unitNumber = :unitNumber', { unitNumber: createDto.unitNumber })
          .andWhere('(unit.deletedAt IS NULL OR unit.deletedAt = "")')
          .select(['unit.id', 'unit.projectId', 'unit.unitNumber'])
          .getOne();
        
        let unit = unitResult;

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
      status: 'under_construction',
      isActive: true,
    });

    return this.propertyRepository.save(property);
  }

  async update(id: string, userId: string, updateDto: UpdatePropertyDto) {
    const property = await this.findById(id, userId);
    if (!property) {
      throw new NotFoundException('Объект не найден');
    }

    Object.assign(property, updateDto);
    return this.propertyRepository.save(property);
  }

  async getProperty(id: string, userId: string) {
    return this.findById(id, userId);
  }
}

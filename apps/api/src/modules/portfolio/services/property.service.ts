import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerProperty } from '../../database/entities/owner-property.entity';
import { Project } from '../../database/entities/project.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(OwnerProperty)
    private propertyRepository: Repository<OwnerProperty>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
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
   */
  async create(ownerId: string, createDto: CreatePropertyDto) {
    let managerId: string | null = null;

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

    const property = this.propertyRepository.create({
      ...createDto,
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

/**
 * AdminService - сервис для административных операций
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../database/entities/user.entity';
import { OwnerProperty } from '../database/entities/owner-property.entity';
import { Dictionary } from '../database/entities/dictionary.entity';
import { SLASettings } from '../database/entities/sla-settings.entity';
import { PropertyEvent } from '../database/entities/property-event.entity';
import { Project } from '../database/entities/project.entity';
import { Unit } from '../database/entities/unit.entity';
import { ManagementCompany } from '../database/entities/management-company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { AssignManagerDto } from './dto/assign-manager.dto';
import { UpdateSLASettingsDto } from './dto/update-sla-settings.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OwnerProperty)
    private propertyRepository: Repository<OwnerProperty>,
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
    @InjectRepository(SLASettings)
    private slaRepository: Repository<SLASettings>,
    @InjectRepository(PropertyEvent)
    private eventRepository: Repository<PropertyEvent>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    @InjectRepository(ManagementCompany)
    private managementCompanyRepository: Repository<ManagementCompany>,
  ) {}

  // ========== Управление пользователями ==========

  async findAllUsers(role?: string, isActive?: boolean) {
    const where: FindOptionsWhere<User> = {};
    if (role) where.role = role as any;
    if (isActive !== undefined) where.isActive = isActive;

    return this.userRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  async createUser(createDto: CreateUserDto) {
    const existing = await this.userRepository.findOne({ where: { login: createDto.login } });
    if (existing) {
      throw new BadRequestException('Пользователь с таким логином уже существует');
    }

    const passwordHash = await bcrypt.hash(createDto.password, 10);
    const user = this.userRepository.create({
      ...createDto,
      passwordHash,
    });

    return this.userRepository.save(user);
  }

  async updateUser(id: string, updateDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    if (updateDto.login && updateDto.login !== user.login) {
      const existing = await this.userRepository.findOne({ where: { login: updateDto.login } });
      if (existing) {
        throw new BadRequestException('Пользователь с таким логином уже существует');
      }
    }

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10) as any;
    }

    Object.assign(user, updateDto);
    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);
    user.isActive = false;
    return this.userRepository.save(user);
  }

  // ========== Управление справочниками ==========

  async findAllDictionaries(type?: string) {
    const where: FindOptionsWhere<Dictionary> = {};
    if (type) where.type = type as any;

    return this.dictionaryRepository.find({
      where,
      order: { sortOrder: 'ASC', label: 'ASC' },
    });
  }

  async findDictionaryById(id: string) {
    const dict = await this.dictionaryRepository.findOne({ where: { id } });
    if (!dict) {
      throw new NotFoundException(`Запись справочника с ID ${id} не найдена`);
    }
    return dict;
  }

  async createDictionary(createDto: CreateDictionaryDto) {
    const existing = await this.dictionaryRepository.findOne({
      where: { type: createDto.type, key: createDto.key },
    });
    if (existing) {
      throw new BadRequestException(`Запись с ключом "${createDto.key}" уже существует в справочнике "${createDto.type}"`);
    }

    const dict = this.dictionaryRepository.create({
      ...createDto,
      metadata: createDto.metadata || {},
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
    });

    return this.dictionaryRepository.save(dict);
  }

  async updateDictionary(id: string, updateDto: UpdateDictionaryDto) {
    const dict = await this.findDictionaryById(id);
    Object.assign(dict, updateDto);
    return this.dictionaryRepository.save(dict);
  }

  async deleteDictionary(id: string) {
    const dict = await this.findDictionaryById(id);
    dict.isActive = false;
    return this.dictionaryRepository.save(dict);
  }

  // ========== Управление SLA настройками ==========

  async findAllSLASettings() {
    return this.slaRepository.find({ order: { type: 'ASC' } });
  }

  async findSLASettingsByType(type: 'construction_update' | 'rental_update') {
    let settings = await this.slaRepository.findOne({ where: { type } });
    if (!settings) {
      settings = this.slaRepository.create({
        type,
        mode: type === 'construction_update' ? 'monthly_window' : 'days_threshold',
        windowStartDay: type === 'construction_update' ? 1 : null,
        windowEndDay: type === 'construction_update' ? 5 : null,
        thresholdDays: type === 'rental_update' ? 30 : null,
        isActive: true,
      });
      settings = await this.slaRepository.save(settings);
    }
    return settings;
  }

  async updateSLASettings(type: 'construction_update' | 'rental_update', updateDto: UpdateSLASettingsDto) {
    let settings = await this.slaRepository.findOne({ where: { type } });
    if (!settings) {
      settings = this.slaRepository.create({
        type,
        mode: updateDto.mode || (type === 'construction_update' ? 'monthly_window' : 'days_threshold'),
        windowStartDay: updateDto.windowStartDay ?? null,
        windowEndDay: updateDto.windowEndDay ?? null,
        thresholdDays: updateDto.thresholdDays ?? null,
        isActive: true,
      });
    } else {
      Object.assign(settings, updateDto);
    }
    return this.slaRepository.save(settings);
  }

  // ========== Управление объектами и назначение менеджеров ==========

  async findAllProperties(managerId?: string, ownerId?: string, status?: string) {
    const where: FindOptionsWhere<OwnerProperty> = {};
    if (managerId) where.managerId = managerId;
    if (ownerId) where.ownerId = ownerId;
    if (status) where.status = status as any;

    return this.propertyRepository.find({
      where,
      relations: ['owner', 'manager', 'unit', 'managementCompany'],
      order: { createdAt: 'DESC' },
    });
  }

  async assignManager(propertyId: string, assignDto: AssignManagerDto, adminUserId?: string) {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['owner', 'manager'],
    });
    if (!property) {
      throw new NotFoundException(`Объект с ID ${propertyId} не найден`);
    }

    // Логирование изменений менеджера
    if (assignDto.managerId !== undefined) {
      const oldManagerId = property.managerId;
      const newManagerId = assignDto.managerId;

      if (assignDto.managerId) {
        const manager = await this.userRepository.findOne({ where: { id: assignDto.managerId } });
        if (!manager || manager.role !== 'manager') {
          throw new BadRequestException('Указанный пользователь не является менеджером');
        }
      }

      property.managerId = assignDto.managerId;

      // Создаем событие для логирования
      if (oldManagerId !== newManagerId) {
        const event = this.eventRepository.create({
          propertyId: property.id,
          createdById: adminUserId || null,
          changeType: oldManagerId === null ? 'manager_assigned' : 'manager_changed',
          beforeValue: { managerId: oldManagerId },
          afterValue: { managerId: newManagerId },
          description: oldManagerId === null
            ? `Менеджер назначен на объект "${property.name}"`
            : `Менеджер изменен на объекте "${property.name}"`,
        });
        await this.eventRepository.save(event);
      }
    }

    // Логирование изменений владельца
    if (assignDto.ownerId !== undefined) {
      const oldOwnerId = property.ownerId;
      const newOwnerId = assignDto.ownerId;

      if (assignDto.ownerId) {
        const owner = await this.userRepository.findOne({ where: { id: assignDto.ownerId } });
        if (!owner) {
          throw new BadRequestException('Пользователь не найден');
        }
        if (owner.role !== 'owner') {
          throw new BadRequestException('Указанный пользователь не является владельцем. Роль должна быть "owner"');
        }
      }

      property.ownerId = assignDto.ownerId;

      // Создаем событие для логирования
      if (oldOwnerId !== newOwnerId) {
        const event = this.eventRepository.create({
          propertyId: property.id,
          createdById: adminUserId || null,
          changeType: 'owner_changed',
          beforeValue: { ownerId: oldOwnerId },
          afterValue: { ownerId: newOwnerId },
          description: `Владелец изменен на объекте "${property.name}"`,
        });
        await this.eventRepository.save(event);
      }
    }

    // Логирование изменений управляющей компании
    if (assignDto.managementCompanyId !== undefined) {
      const oldCompanyId = property.managementCompanyId;
      const newCompanyId = assignDto.managementCompanyId;

      if (assignDto.managementCompanyId) {
        const company = await this.managementCompanyRepository.findOne({ where: { id: assignDto.managementCompanyId } });
        if (!company) {
          throw new BadRequestException('Управляющая компания не найдена');
        }
      }

      property.managementCompanyId = assignDto.managementCompanyId;

      // Создаем событие для логирования
      if (oldCompanyId !== newCompanyId) {
        const event = this.eventRepository.create({
          propertyId: property.id,
          createdById: adminUserId || null,
          changeType: 'management_company_assigned',
          beforeValue: { managementCompanyId: oldCompanyId },
          afterValue: { managementCompanyId: newCompanyId },
          description: `Управляющая компания ${newCompanyId ? 'назначена' : 'удалена'} на объекте "${property.name}"`,
        });
        await this.eventRepository.save(event);
      }
    }

    return this.propertyRepository.save(property);
  }

  // ========== Просмотр логов действий ==========

  async findAllEvents(userId?: string, propertyId?: string, changeType?: string, limit: number = 100) {
    const where: FindOptionsWhere<PropertyEvent> = {};
    if (userId) where.createdById = userId;
    if (propertyId) where.propertyId = propertyId;
    if (changeType) where.changeType = changeType as any;

    return this.eventRepository.find({
      where,
      relations: ['property'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // ========== Управление проектами ==========

  async findAllProjects() {
    return this.projectRepository.find({
      where: { deletedAt: null },
      relations: [],
      order: { name: 'ASC' },
    });
  }

  async findProjectById(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Проект с ID ${id} не найден`);
    }
    return project;
  }

  async updateProjectDefaultManager(projectId: string, managerId: string | null) {
    const project = await this.findProjectById(projectId);

    if (managerId) {
      const manager = await this.userRepository.findOne({ where: { id: managerId } });
      if (!manager || manager.role !== 'manager') {
        throw new BadRequestException('Указанный пользователь не является менеджером');
      }
    }

    project.defaultManagerId = managerId;
    return this.projectRepository.save(project);
  }

  // ========== Управление юнитами ==========

  async findAllUnits(projectId?: string, managerId?: string) {
    const where: FindOptionsWhere<Unit> = { deletedAt: null };
    if (projectId) where.projectId = projectId;
    if (managerId) where.managerId = managerId;

    return this.unitRepository.find({
      where,
      relations: ['project'],
      order: { unitNumber: 'ASC' },
    });
  }

  async findUnitById(id: string) {
    const unit = await this.unitRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!unit) {
      throw new NotFoundException(`Юнит с ID ${id} не найден`);
    }
    return unit;
  }

  async assignManagerToUnit(unitId: string, managerId: string | null) {
    const unit = await this.findUnitById(unitId);

    if (managerId) {
      const manager = await this.userRepository.findOne({ where: { id: managerId } });
      if (!manager || manager.role !== 'manager') {
        throw new BadRequestException('Указанный пользователь не является менеджером');
      }
    }

    unit.managerId = managerId;
    return this.unitRepository.save(unit);
  }
}

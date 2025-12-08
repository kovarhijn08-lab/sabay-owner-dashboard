import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../database/entities/project.entity';
import { Unit } from '../database/entities/unit.entity';

/**
 * CatalogService - сервис для работы с каталогом проектов и юнитов
 * 
 * Предоставляет доступ к каталогу проектов недвижимости для всех пользователей
 */
@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  /**
   * Получить все проекты (каталог)
   * @param region - фильтр по региону (опционально)
   */
  async getProjects(region?: string) {
    const where: any = { deletedAt: null };
    if (region) {
      where.region = region;
    }

    return this.projectRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  /**
   * Получить проект по ID
   */
  async getProjectById(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id, deletedAt: null },
    });
    return project;
  }

  /**
   * Получить все юниты проекта
   */
  async getUnitsByProject(projectId: string) {
    return this.unitRepository.find({
      where: { projectId, deletedAt: null },
      order: { unitNumber: 'ASC' },
    });
  }

  /**
   * Получить юнит по ID
   */
  async getUnitById(id: string) {
    const unit = await this.unitRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['project'],
    });
    return unit;
  }

  /**
   * Получить список регионов (уникальные значения)
   */
  async getRegions() {
    const projects = await this.projectRepository.find({
      where: { deletedAt: null },
      select: ['region'],
    });
    
    const regions = [...new Set(projects.map(p => p.region).filter(Boolean))];
    return regions.sort();
  }
}

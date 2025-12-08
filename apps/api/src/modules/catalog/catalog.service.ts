import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  /**
   * Получить все проекты (каталог)
   * @param region - фильтр по региону (опционально)
   */
  async getProjects(region?: string) {
    try {
      // Проверяем подключение к базе
      const dbOptions = this.dataSource.options as any;
      console.log(`[CatalogService] Database path: ${dbOptions.database}`);
      
      // Проверяем количество проектов напрямую
      const countQuery = 'SELECT COUNT(*) as count FROM projects';
      const countResult = await this.dataSource.query(countQuery);
      console.log(`[CatalogService] Total projects in database: ${countResult[0]?.count || 0}`);
      
      // Используем raw SQL запрос, так как TypeORM не может правильно маппить данные
      let query = `
        SELECT 
          id, name, region, city, country, developer, propertyType, 
          housingClass, floorsFrom, floorsTo, ceilingHeight,
          constructionStart, plannedConstructionEnd, plannedHandoverDate,
          objectType, wallType, hasElevator, parking, courtyard,
          infrastructure, location, distanceToSea, address, mapLocation,
          googleDriveFolder, description, locationDescription,
          finishingDescription, comments, defaultManagerId,
          createdAt, updatedAt, deletedAt
        FROM projects
        WHERE (deletedAt IS NULL OR deletedAt = '')
      `;
      
      const params: any[] = [];
      if (region) {
        query += ' AND region = ?';
        params.push(region);
      }
      
      query += ' ORDER BY name ASC';
      
      const rawProjects = await this.dataSource.query(query, params);
      console.log(`[CatalogService] Raw query returned ${rawProjects.length} projects`);
      
      // Маппим raw данные в объекты Project
      return rawProjects.map((row: any) => ({
        id: row.id,
        name: row.name,
        region: row.region,
        city: row.city || 'Пхукет',
        country: row.country || 'Таиланд',
        developer: row.developer,
        propertyType: row.propertyType,
        housingClass: row.housingClass,
        floorsFrom: row.floorsFrom,
        floorsTo: row.floorsTo,
        ceilingHeight: row.ceilingHeight,
        constructionStart: row.constructionStart,
        plannedConstructionEnd: row.plannedConstructionEnd,
        plannedHandoverDate: row.plannedHandoverDate,
        objectType: row.objectType,
        wallType: row.wallType,
        hasElevator: row.hasElevator,
        parking: row.parking,
        courtyard: row.courtyard,
        infrastructure: row.infrastructure,
        location: row.location,
        distanceToSea: row.distanceToSea,
        address: row.address,
        mapLocation: row.mapLocation,
        googleDriveFolder: row.googleDriveFolder,
        description: row.description,
        locationDescription: row.locationDescription,
        finishingDescription: row.finishingDescription,
        comments: row.comments,
        defaultManagerId: row.defaultManagerId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        deletedAt: row.deletedAt,
      }));
    } catch (error) {
      console.error('[CatalogService] Error getting projects:', error);
      throw error;
    }
  }

  /**
   * Получить проект по ID
   */
  async getProjectById(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id, deletedAt: IsNull() },
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
    // Используем raw query для получения регионов
    const query = `
      SELECT DISTINCT region 
      FROM projects 
      WHERE (deletedAt IS NULL OR deletedAt = '') 
        AND region IS NOT NULL 
        AND region != ''
      ORDER BY region ASC
    `;
    
    const result = await this.dataSource.query(query);
    return result.map((row: any) => row.region).filter(Boolean);
  }
}

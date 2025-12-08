import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CatalogService } from './catalog.service';

/**
 * CatalogController - контроллер для работы с каталогом проектов
 * 
 * Доступен всем авторизованным пользователям (включая владельцев)
 */
@Controller('catalog')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  /**
   * Получить все проекты каталога
   * GET /api/catalog/projects?region=Банг Тао
   */
  @Get('projects')
  async getProjects(@Query('region') region?: string) {
    return this.catalogService.getProjects(region);
  }

  /**
   * Получить проект по ID
   * GET /api/catalog/projects/:id
   */
  @Get('projects/:id')
  async getProjectById(@Param('id') id: string) {
    return this.catalogService.getProjectById(id);
  }

  /**
   * Получить юниты проекта
   * GET /api/catalog/projects/:id/units
   */
  @Get('projects/:id/units')
  async getUnitsByProject(@Param('id') projectId: string) {
    return this.catalogService.getUnitsByProject(projectId);
  }

  /**
   * Получить юнит по ID
   * GET /api/catalog/units/:id
   */
  @Get('units/:id')
  async getUnitById(@Param('id') id: string) {
    return this.catalogService.getUnitById(id);
  }

  /**
   * Получить список регионов
   * GET /api/catalog/regions
   */
  @Get('regions')
  async getRegions() {
    return this.catalogService.getRegions();
  }
}

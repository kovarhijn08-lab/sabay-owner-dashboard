/**
 * AdminController - контроллер для административных операций
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminOnly } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { AssignManagerDto } from './dto/assign-manager.dto';
import { UpdateSLASettingsDto } from './dto/update-sla-settings.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@AdminOnly()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== Управление пользователями ==========

  @Get('users')
  findAllUsers(@Query('role') role?: string, @Query('isActive') isActive?: string) {
    return this.adminService.findAllUsers(role, isActive === 'true' ? true : isActive === 'false' ? false : undefined);
  }

  @Get('users/:id')
  findUserById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  @Post('users')
  createUser(@Body() createDto: CreateUserDto) {
    return this.adminService.createUser(createDto);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ========== Управление справочниками ==========

  @Get('dictionaries')
  findAllDictionaries(@Query('type') type?: string) {
    return this.adminService.findAllDictionaries(type);
  }

  @Get('dictionaries/:id')
  findDictionaryById(@Param('id') id: string) {
    return this.adminService.findDictionaryById(id);
  }

  @Post('dictionaries')
  createDictionary(@Body() createDto: CreateDictionaryDto) {
    return this.adminService.createDictionary(createDto);
  }

  @Patch('dictionaries/:id')
  updateDictionary(@Param('id') id: string, @Body() updateDto: UpdateDictionaryDto) {
    return this.adminService.updateDictionary(id, updateDto);
  }

  @Delete('dictionaries/:id')
  deleteDictionary(@Param('id') id: string) {
    return this.adminService.deleteDictionary(id);
  }

  // ========== Управление SLA настройками ==========

  @Get('sla')
  findAllSLASettings() {
    return this.adminService.findAllSLASettings();
  }

  @Get('sla/:type')
  findSLASettingsByType(@Param('type') type: 'construction_update' | 'rental_update') {
    return this.adminService.findSLASettingsByType(type);
  }

  @Patch('sla/:type')
  updateSLASettings(
    @Param('type') type: 'construction_update' | 'rental_update',
    @Body() updateDto: UpdateSLASettingsDto,
  ) {
    return this.adminService.updateSLASettings(type, updateDto);
  }

  // ========== Управление объектами и назначение менеджеров ==========

  @Get('properties')
  findAllProperties(
    @Query('managerId') managerId?: string,
    @Query('ownerId') ownerId?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.findAllProperties(managerId, ownerId, status);
  }

  @Patch('properties/:id/assign')
  assignManager(
    @Param('id') propertyId: string,
    @Body() assignDto: AssignManagerDto,
    @Request() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.adminService.assignManager(propertyId, assignDto, adminUserId);
  }

  // ========== Просмотр логов действий ==========

  @Get('logs')
  findAllEvents(
    @Query('userId') userId?: string,
    @Query('propertyId') propertyId?: string,
    @Query('changeType') changeType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.findAllEvents(userId, propertyId, changeType, limit ? parseInt(limit, 10) : 100);
  }

  // ========== Управление проектами ==========

  @Get('projects')
  findAllProjects() {
    return this.adminService.findAllProjects();
  }

  @Get('projects/:id')
  findProjectById(@Param('id') id: string) {
    return this.adminService.findProjectById(id);
  }

  @Patch('projects/:id/default-manager')
  updateProjectDefaultManager(
    @Param('id') projectId: string,
    @Body('managerId') managerId: string | null,
  ) {
    return this.adminService.updateProjectDefaultManager(projectId, managerId);
  }

  // ========== Управление юнитами ==========

  @Get('units')
  findAllUnits(@Query('projectId') projectId?: string, @Query('managerId') managerId?: string) {
    return this.adminService.findAllUnits(projectId, managerId);
  }

  @Get('units/:id')
  findUnitById(@Param('id') id: string) {
    return this.adminService.findUnitById(id);
  }

  @Patch('units/:id/assign-manager')
  assignManagerToUnit(@Param('id') unitId: string, @Body('managerId') managerId: string | null) {
    return this.adminService.assignManagerToUnit(unitId, managerId);
  }
}

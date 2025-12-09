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
  NotFoundException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { OwnerOnly } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { PropertyService } from "./services/property.service";
import { GoalsService } from "./services/goals.service";
import { NotificationService } from "./services/notification.service";
import { PortfolioService } from "./services/portfolio.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";

@Controller("portfolio")
@UseGuards(JwtAuthGuard, RolesGuard)
@OwnerOnly()
export class PortfolioController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly goalsService: GoalsService,
    private readonly notificationService: NotificationService,
    private readonly portfolioService: PortfolioService,
  ) {}

  @Get("summary")
  async getSummary(@CurrentUser() user: any) {
    return this.portfolioService.getSummary(user.id);
  }

  // ========== Управление объектами ==========

  @Get("properties")
  async getProperties(@CurrentUser() user: any) {
    return this.propertyService.findAll(user.id);
  }

  @Get("properties/:id")
  async getPropertyById(@Param("id") id: string, @CurrentUser() user: any) {
    const property = await this.propertyService.getProperty(id, user.id);
    if (!property) {
      throw new NotFoundException("Объект не найден");
    }
    return property;
  }

  @Post("properties")
  async createProperty(
    @Body() createDto: CreatePropertyDto,
    @CurrentUser() user: any,
  ) {
    return this.propertyService.create(user.id, createDto);
  }

  @Patch("properties/:id")
  async updateProperty(
    @Param("id") id: string,
    @Body() updateDto: UpdatePropertyDto,
    @CurrentUser() user: any,
  ) {
    return this.propertyService.update(id, user.id, updateDto);
  }

  @Get("properties/:id/history")
  async getPropertyHistory(
    @Param("id") id: string,
    @Query("limit") limit: string,
    @CurrentUser() user: any,
  ) {
    return this.propertyService.getPropertyHistory(
      id,
      user.id,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get("properties/:id/analytics")
  async getPropertyAnalytics(
    @Param("id") id: string,
    @CurrentUser() user: any,
  ) {
    return this.propertyService.getPropertyAnalytics(id, user.id);
  }

  // ========== Управление целями ==========

  @Get("goals")
  async getActiveGoals(
    @Query("propertyId") propertyId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.goalsService.findByOwnerId(user.id, propertyId);
  }

  @Get("goals/archived")
  async getArchivedGoals(
    @Query("propertyId") propertyId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.goalsService.findArchivedByOwnerId(user.id, propertyId);
  }

  @Post("goals")
  async createGoal(@Body() createDto: CreateGoalDto, @CurrentUser() user: any) {
    return this.goalsService.create(user.id, createDto);
  }

  @Patch("goals/:id")
  async updateGoal(
    @Param("id") id: string,
    @Body() updateDto: UpdateGoalDto,
    @CurrentUser() user: any,
  ) {
    return this.goalsService.update(id, user.id, updateDto);
  }

  @Delete("goals/:id")
  async deleteGoal(@Param("id") id: string, @CurrentUser() user: any) {
    return this.goalsService.delete(id, user.id);
  }

  @Get("forecasts")
  async getForecasts(@CurrentUser() user: any) {
    return this.portfolioService.getForecasts(user.id);
  }

  @Get("chart-data")
  async getChartData(@CurrentUser() user: any) {
    return this.portfolioService.getPortfolioChartData(user.id);
  }

  // ========== Уведомления ==========

  @Get("notifications")
  async getNotifications(@CurrentUser() user: any) {
    return this.notificationService.findByUserId(user.id);
  }

  @Patch("notifications/:id/read")
  async markNotificationAsRead(
    @Param("id") id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationService.markAsRead(id, user.id);
  }

  @Patch("notifications/read-all")
  async markAllNotificationsAsRead(@CurrentUser() user: any) {
    return this.notificationService.markAllAsRead(user.id);
  }
}

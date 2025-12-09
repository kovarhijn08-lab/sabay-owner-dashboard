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
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ManagerOnly } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ManagerService } from "./manager.service";
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

@Controller("manager")
@UseGuards(JwtAuthGuard, RolesGuard)
@ManagerOnly()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get("properties")
  async getMyProperties(@CurrentUser() user: any) {
    return this.managerService.findMyProperties(user.id);
  }

  @Get("properties/:id")
  async getPropertyById(@Param("id") id: string, @CurrentUser() user: any) {
    return this.managerService.getPropertyById(id, user.id);
  }

  // ========== Construction Updates ==========

  @Get("properties/:id/construction-updates")
  async getConstructionUpdates(
    @Param("id") propertyId: string,
    @CurrentUser() user: any,
  ) {
    return this.managerService.getConstructionUpdates(propertyId, user.id);
  }

  @Post("properties/:id/construction-updates")
  async addConstructionUpdate(
    @Param("id") propertyId: string,
    @Body() dto: CreateConstructionUpdateDto,
    @CurrentUser() user: any,
    @Body("reasonForDecrease") reasonForDecrease?: string,
  ) {
    return this.managerService.addConstructionUpdate(
      propertyId,
      dto,
      user.id,
      reasonForDecrease,
    );
  }

  @Patch("construction-updates/:updateId")
  async updateConstructionUpdate(
    @Param("updateId") updateId: string,
    @Body() dto: UpdateConstructionUpdateDto,
    @CurrentUser() user: any,
    @Body("reasonForDecrease") reasonForDecrease?: string,
  ) {
    return this.managerService.updateConstructionUpdate(
      updateId,
      dto,
      user.id,
      reasonForDecrease,
    );
  }

  @Delete("construction-updates/:updateId")
  async deleteConstructionUpdate(
    @Param("updateId") updateId: string,
    @CurrentUser() user: any,
  ) {
    return this.managerService.deleteConstructionUpdate(updateId, user.id);
  }

  // ========== Bookings ==========

  @Get("properties/:id/bookings")
  async getBookings(@Param("id") propertyId: string, @CurrentUser() user: any) {
    return this.managerService.getBookings(propertyId, user.id);
  }

  @Post("properties/:id/bookings")
  async addBooking(
    @Param("id") propertyId: string,
    @Body() dto: CreateBookingDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.addBooking(propertyId, dto, user.id);
  }

  @Patch("bookings/:bookingId")
  async updateBooking(
    @Param("bookingId") bookingId: string,
    @Body() dto: UpdateBookingDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.updateBooking(bookingId, dto, user.id);
  }

  @Delete("bookings/:bookingId")
  async deleteBooking(
    @Param("bookingId") bookingId: string,
    @CurrentUser() user: any,
  ) {
    return this.managerService.deleteBooking(bookingId, user.id);
  }

  // ========== Expenses ==========

  @Get("properties/:id/expenses")
  async getExpenses(@Param("id") propertyId: string, @CurrentUser() user: any) {
    return this.managerService.getExpenses(propertyId, user.id);
  }

  @Post("properties/:id/expenses")
  async addExpense(
    @Param("id") propertyId: string,
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.addExpense(propertyId, dto, user.id);
  }

  @Patch("expenses/:expenseId")
  async updateExpense(
    @Param("expenseId") expenseId: string,
    @Body() dto: UpdateExpenseDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.updateExpense(expenseId, dto, user.id);
  }

  @Delete("expenses/:expenseId")
  async deleteExpense(
    @Param("expenseId") expenseId: string,
    @CurrentUser() user: any,
  ) {
    return this.managerService.deleteExpense(expenseId, user.id);
  }

  // ========== Payouts ==========

  @Get("properties/:id/payouts")
  async getPayouts(@Param("id") propertyId: string, @CurrentUser() user: any) {
    return this.managerService.getPayouts(propertyId, user.id);
  }

  @Post("properties/:id/payouts")
  async createPayout(
    @Param("id") propertyId: string,
    @Body() dto: CreatePayoutDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.createPayout(propertyId, dto, user.id);
  }

  @Patch("payouts/:payoutId")
  async updatePayout(
    @Param("payoutId") payoutId: string,
    @Body() dto: UpdatePayoutDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.updatePayout(payoutId, dto, user.id);
  }

  @Delete("payouts/:payoutId")
  async deletePayout(
    @Param("payoutId") payoutId: string,
    @CurrentUser() user: any,
  ) {
    return this.managerService.deletePayout(payoutId, user.id);
  }

  // ========== Valuations ==========

  @Get("properties/:id/valuations")
  async getValuations(
    @Param("id") propertyId: string,
    @CurrentUser() user: any,
  ) {
    return this.managerService.getValuations(propertyId, user.id);
  }

  @Post("properties/:id/valuations")
  async addValuation(
    @Param("id") propertyId: string,
    @Body() dto: CreateValuationDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.addValuation(propertyId, dto, user.id);
  }

  @Patch("valuations/:valuationId")
  async updateValuation(
    @Param("valuationId") valuationId: string,
    @Body() dto: UpdateValuationDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.updateValuation(valuationId, dto, user.id);
  }

  // ========== Documents ==========

  @Get("properties/:id/documents")
  async getDocuments(
    @Param("id") propertyId: string,
    @CurrentUser() user: any,
  ) {
    return this.managerService.getDocuments(propertyId, user.id);
  }

  @Post("properties/:id/documents")
  async uploadDocument(
    @Param("id") propertyId: string,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: any,
  ) {
    return this.managerService.uploadDocument(propertyId, dto, user.id);
  }

  @Delete("documents/:documentId")
  async deleteDocument(
    @Param("documentId") documentId: string,
    @CurrentUser() user: any,
  ) {
    return this.managerService.deleteDocument(documentId, user.id);
  }

  // ========== Events ==========

  @Get("properties/:id/events")
  async getPropertyEvents(
    @Param("id") propertyId: string,
    @CurrentUser() user: any,
    @Query("limit") limit?: string,
  ) {
    return this.managerService.getPropertyEvents(
      propertyId,
      user.id,
      limit ? parseInt(limit, 10) : 50,
    );
  }
}

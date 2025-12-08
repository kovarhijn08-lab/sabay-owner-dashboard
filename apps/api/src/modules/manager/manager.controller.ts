import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ManagerOnly } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ManagerService } from './manager.service';

@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)
@ManagerOnly()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('properties')
  async getMyProperties(@CurrentUser() user: any) {
    return this.managerService.findMyProperties(user.id);
  }
}

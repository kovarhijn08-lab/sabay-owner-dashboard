import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { PropertyService } from './services/property.service';
import { PortfolioService } from './services/portfolio.service';
import { GoalsService } from './services/goals.service';
import { NotificationService } from './services/notification.service';
import { OwnerProperty } from '../database/entities/owner-property.entity';
import { Project } from '../database/entities/project.entity';
import { Unit } from '../database/entities/unit.entity';
import { PortfolioGoal } from '../database/entities/portfolio-goal.entity';
import { Notification } from '../database/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OwnerProperty, Project, Unit, PortfolioGoal, Notification]),
  ],
  controllers: [PortfolioController],
  providers: [PropertyService, PortfolioService, GoalsService, NotificationService],
  exports: [PropertyService, GoalsService, NotificationService],
})
export class PortfolioModule {}

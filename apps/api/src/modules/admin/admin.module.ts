import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../database/entities/user.entity';
import { OwnerProperty } from '../database/entities/owner-property.entity';
import { Dictionary } from '../database/entities/dictionary.entity';
import { SLASettings } from '../database/entities/sla-settings.entity';
import { PropertyEvent } from '../database/entities/property-event.entity';
import { Project } from '../database/entities/project.entity';
import { ManagementCompany } from '../database/entities/management-company.entity';
import { Unit } from '../database/entities/unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OwnerProperty,
      Dictionary,
      SLASettings,
      PropertyEvent,
      Project,
      ManagementCompany,
      Unit,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

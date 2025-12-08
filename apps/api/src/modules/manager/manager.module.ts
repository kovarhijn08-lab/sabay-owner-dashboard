import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { OwnerProperty } from '../database/entities/owner-property.entity';
import { Unit } from '../database/entities/unit.entity';
import { Project } from '../database/entities/project.entity';
import { ConstructionUpdate } from '../database/entities/construction-update.entity';
import { Booking } from '../database/entities/booking.entity';
import { Expense } from '../database/entities/expense.entity';
import { Payout } from '../database/entities/payout.entity';
import { Valuation } from '../database/entities/valuation.entity';
import { Document } from '../database/entities/document.entity';
import { PropertyEvent } from '../database/entities/property-event.entity';
import { Dictionary } from '../database/entities/dictionary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OwnerProperty,
      Unit,
      Project,
      ConstructionUpdate,
      Booking,
      Expense,
      Payout,
      Valuation,
      Document,
      PropertyEvent,
      Dictionary,
    ]),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}

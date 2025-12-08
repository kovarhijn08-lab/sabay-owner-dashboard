import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { CatalogModule } from '../catalog/catalog.module';
import { AdminModule } from '../admin/admin.module';
import { ManagerModule } from '../manager/manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(__dirname, '../../../.env.local'), join(__dirname, '../../../.env')],
    }),
    DatabaseModule,
    AuthModule,
    PortfolioModule,
    CatalogModule,
    AdminModule,
    ManagerModule,
  ],
})
export class AppModule {}

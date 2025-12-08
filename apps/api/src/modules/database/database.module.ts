import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import * as entities from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): DataSourceOptions => {
        const dbType = configService.get<string>('DB_TYPE', 'better-sqlite3');
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            url: configService.get<string>('DATABASE_URL'),
            entities: Object.values(entities),
            synchronize: false,
            logging: configService.get<string>('NODE_ENV') === 'development',
          };
        } else {
          return {
            type: 'better-sqlite3',
            database: configService.get<string>('DATABASE_PATH', './data/database.sqlite'),
            entities: Object.values(entities),
            synchronize: true,
            logging: configService.get<string>('NODE_ENV') === 'development',
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

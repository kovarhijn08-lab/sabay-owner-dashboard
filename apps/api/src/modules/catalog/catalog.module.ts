import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";
import { Project } from "../database/entities/project.entity";
import { Unit } from "../database/entities/unit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Unit])],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}

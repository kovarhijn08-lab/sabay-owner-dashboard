import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerProperty } from '../database/entities/owner-property.entity';
import { Unit } from '../database/entities/unit.entity';
import { Project } from '../database/entities/project.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(OwnerProperty)
    private propertyRepository: Repository<OwnerProperty>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findMyProperties(managerId: string) {
    return this.propertyRepository.find({
      where: { managerId, deletedAt: null },
      relations: ['owner', 'unit'],
      order: { createdAt: 'DESC' },
    });
  }
}

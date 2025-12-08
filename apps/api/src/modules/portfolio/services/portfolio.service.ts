import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerProperty } from '../../database/entities/owner-property.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(OwnerProperty)
    private propertyRepository: Repository<OwnerProperty>,
  ) {}

  async findAll() {
    return this.propertyRepository.find({
      where: { deletedAt: null },
      relations: ['owner', 'manager', 'unit'],
      order: { createdAt: 'DESC' },
    });
  }
}

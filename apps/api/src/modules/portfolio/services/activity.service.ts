import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEvent } from '../../database/entities/property-event.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(PropertyEvent)
    private eventRepository: Repository<PropertyEvent>,
  ) {}

  async findByPropertyId(propertyId: string, limit: number = 50) {
    return this.eventRepository.find({
      where: { propertyId },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}

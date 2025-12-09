import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PortfolioGoal } from "../../database/entities/portfolio-goal.entity";
import { CreateGoalDto } from "../dto/create-goal.dto";
import { UpdateGoalDto } from "../dto/update-goal.dto";

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(PortfolioGoal)
    private goalRepository: Repository<PortfolioGoal>,
  ) {}

  async findByOwnerId(ownerId: string, propertyId?: string) {
    const where: any = { ownerId, status: "active" };
    if (propertyId) {
      where.propertyId = propertyId;
    }
    return this.goalRepository.find({
      where,
      relations: ["property"],
      order: { createdAt: "DESC" },
    });
  }

  async findArchivedByOwnerId(ownerId: string, propertyId?: string) {
    const where: any = { ownerId, status: "archived" };
    if (propertyId) {
      where.propertyId = propertyId;
    }
    return this.goalRepository.find({
      where,
      relations: ["property"],
      order: { createdAt: "DESC" },
    });
  }

  async create(ownerId: string, createDto: CreateGoalDto) {
    const goal = this.goalRepository.create({
      ...createDto,
      ownerId,
      status: "active",
    });
    return this.goalRepository.save(goal);
  }

  async update(id: string, ownerId: string, updateDto: UpdateGoalDto) {
    const goal = await this.goalRepository.findOne({
      where: { id, ownerId },
    });
    if (!goal) {
      throw new NotFoundException("Цель не найдена");
    }

    Object.assign(goal, updateDto);
    return this.goalRepository.save(goal);
  }

  async delete(id: string, ownerId: string) {
    const goal = await this.goalRepository.findOne({
      where: { id, ownerId },
    });
    if (!goal) {
      throw new NotFoundException("Цель не найдена");
    }

    return this.goalRepository.remove(goal);
  }

  // Обратная совместимость (можно удалить позже)
  async findByUserId(userId: string) {
    return this.findByOwnerId(userId);
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Сущность Project - каталог проектов недвижимости
 *
 * Что здесь хранится:
 * - Информация о проектах недвижимости на Пхукете
 * - Характеристики проектов (для справочника)
 * - Используется как каталог при создании объектов инвесторами
 *
 * Отличие от OwnerProperty:
 * - Project - это каталог доступных проектов (не купленные)
 * - OwnerProperty - это объекты, купленные конкретными инвесторами
 */
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === Основная информация ===

  @Column({ type: 'varchar', length: 255 })
  name!: string; // Название проекта

  @Column({ type: 'varchar', length: 100, default: 'Таиланд' })
  country!: string; // Страна

  @Column({ type: 'varchar', length: 100, default: 'Пхукет' })
  city!: string; // Город

  @Column({ type: 'varchar', length: 255 })
  region!: string; // Район (Банг Тао, Камала, и т.д.)

  @Column({ type: 'varchar', length: 255, nullable: true })
  developer!: string | null; // Застройщик

  @Column({ type: 'varchar', length: 100, nullable: true })
  propertyType!: string | null; // Тип недвижимости

  @Column({ type: 'varchar', length: 100, nullable: true })
  housingClass!: string | null; // Класс жилья

  // === Характеристики здания ===

  @Column({ type: 'integer', nullable: true })
  floorsFrom!: number | null; // Этажность от

  @Column({ type: 'integer', nullable: true })
  floorsTo!: number | null; // Этажность до

  @Column({ type: 'varchar', length: 50, nullable: true })
  ceilingHeight!: string | null; // Высота потолков

  // === Даты строительства ===

  @Column({ type: 'varchar', length: 50, nullable: true })
  constructionStart!: string | null; // Начало строительства (Q4 2023)

  @Column({ type: 'varchar', length: 50, nullable: true })
  plannedConstructionEnd!: string | null; // Окончание строительства планируемое

  @Column({ type: 'varchar', length: 50, nullable: true })
  plannedHandoverDate!: string | null; // Дата сдачи планируемая

  @Column({ type: 'varchar', length: 100, nullable: true })
  objectType!: string | null; // Тип объекта (Строящееся здание)

  // === Характеристики ===

  @Column({ type: 'text', nullable: true })
  wallType!: string | null; // Тип стен

  @Column({ type: 'varchar', length: 10, nullable: true })
  hasElevator!: string | null; // Лифт (Есть/Нет)

  @Column({ type: 'text', nullable: true })
  parking!: string | null; // Парковка

  @Column({ type: 'varchar', length: 50, nullable: true })
  courtyard!: string | null; // Двор

  @Column({ type: 'text', nullable: true })
  infrastructure!: string | null; // Инфраструктура ЖК

  @Column({ type: 'text', nullable: true })
  location!: string | null; // Расположение

  @Column({ type: 'varchar', length: 100, nullable: true })
  distanceToSea!: string | null; // Удалённость от моря

  // === Адрес и ссылки ===

  @Column({ type: 'text', nullable: true })
  address!: string | null; // Адрес

  @Column({ type: 'varchar', length: 500, nullable: true })
  mapLocation!: string | null; // Локация проекта (Google Maps ссылка)

  @Column({ type: 'varchar', length: 500, nullable: true })
  googleDriveFolder!: string | null; // Папка на гугл диске

  // === Описания ===

  @Column({ type: 'text', nullable: true })
  description!: string | null; // Текст о ЖК

  @Column({ type: 'text', nullable: true })
  locationDescription!: string | null; // Текст о расположении

  @Column({ type: 'text', nullable: true })
  finishingDescription!: string | null; // Текст в отделке

  @Column({ type: 'text', nullable: true })
  comments!: string | null; // Коментарии

  // === Менеджер по умолчанию ===

  // ID менеджера по умолчанию для этого проекта (nullable)
  // Используется при создании OwnerProperty, если не указан явно managerId
  @Column({ type: 'uuid', nullable: true })
  defaultManagerId!: string | null;

  // === Служебные поля ===

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Soft delete
  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;
}

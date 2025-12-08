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

  /**
   * Получить сводку по портфелю для владельца
   */
  async getSummary(ownerId: string) {
    const properties = await this.propertyRepository.find({
      where: { ownerId, deletedAt: null },
      relations: ['unit'],
    });

    const totalProperties = properties.length;
    
    // Общая стоимость покупки
    const totalPurchaseValue = properties.reduce(
      (sum, p) => sum + (p.purchasePrice || 0),
      0,
    );

    // Текущая оценка портфеля
    const totalCurrentValue = properties.reduce(
      (sum, p) => sum + (p.currentEstimate || p.purchasePrice || 0),
      0,
    );

    // Прирост стоимости
    const valueGrowth = totalCurrentValue - totalPurchaseValue;
    const valueGrowthPercent = totalPurchaseValue > 0 
      ? (valueGrowth / totalPurchaseValue) * 100 
      : 0;

    // Объекты в аренде
    const rentalProperties = properties.filter(p => p.status === 'rental');
    const rentalCount = rentalProperties.length;

    // Объекты в строительстве
    const constructionProperties = properties.filter(p => p.status === 'under_construction');
    const constructionCount = constructionProperties.length;

    // Средний ROI (упрощенный расчет)
    const averageROI = properties.length > 0
      ? properties.reduce((sum, p) => {
          const purchasePrice = p.purchasePrice || 0;
          const currentValue = p.currentEstimate || purchasePrice;
          const roi = purchasePrice > 0 ? ((currentValue - purchasePrice) / purchasePrice) * 100 : 0;
          return sum + roi;
        }, 0) / properties.length
      : 0;

    return {
      totalProperties,
      totalPurchaseValue,
      totalCurrentValue,
      valueGrowth,
      valueGrowthPercent: Math.round(valueGrowthPercent * 100) / 100,
      rentalCount,
      constructionCount,
      averageROI: Math.round(averageROI * 100) / 100,
    };
  }

  /**
   * Получить прогнозы по портфелю
   */
  async getForecasts(ownerId: string) {
    const properties = await this.propertyRepository.find({
      where: { ownerId, deletedAt: null },
    });

    // Прогноз годового дохода от объектов в аренде
    const rentalProperties = properties.filter(p => p.status === 'rental');
    let forecastYearlyIncome = 0;
    rentalProperties.forEach(p => {
      if (p.expectedAdr && p.expectedOccupancy) {
        // Расчет: ADR * загрузка * 365 дней
        const dailyIncome = p.expectedAdr * (p.expectedOccupancy / 100);
        forecastYearlyIncome += dailyIncome * 365;
      }
    });

    // Прогноз дохода от объектов в строительстве (после завершения)
    const constructionProperties = properties.filter(p => p.status === 'under_construction');
    let forecastConstructionIncome = 0;
    constructionProperties.forEach(p => {
      if (p.expectedAdr && p.expectedOccupancy) {
        // Учитываем только если объект будет завершен в течение года
        const dailyIncome = p.expectedAdr * (p.expectedOccupancy / 100);
        // Упрощенный расчет: предполагаем, что объект будет сдан в течение года
        if (p.plannedCompletionDate) {
          const completionDate = new Date(p.plannedCompletionDate);
          const now = new Date();
          const daysUntilCompletion = Math.max(0, Math.floor((completionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          if (daysUntilCompletion <= 365) {
            const remainingDays = 365 - daysUntilCompletion;
            forecastConstructionIncome += dailyIncome * remainingDays;
          }
        }
      }
    });

    const totalForecastIncome = forecastYearlyIncome + forecastConstructionIncome;

    // Прогноз роста стоимости (упрощенный: средний рост 5% в год)
    const totalCurrentValue = properties.reduce(
      (sum, p) => sum + (p.currentEstimate || p.purchasePrice || 0),
      0,
    );
    const forecastValueGrowth = totalCurrentValue * 0.05; // 5% годовой рост

    return {
      forecastYearlyIncome: Math.round(forecastYearlyIncome),
      forecastConstructionIncome: Math.round(forecastConstructionIncome),
      totalForecastIncome: Math.round(totalForecastIncome),
      forecastValueGrowth: Math.round(forecastValueGrowth),
    };
  }

  /**
   * Получить данные для графиков портфеля
   */
  async getPortfolioChartData(ownerId: string) {
    const properties = await this.propertyRepository.find({
      where: { ownerId, deletedAt: null },
      order: { createdAt: 'ASC' },
    });

    // Данные для графика динамики стоимости портфеля
    const valueData: Array<{ date: string; purchaseValue: number; currentValue: number }> = [];
    let cumulativePurchase = 0;
    let cumulativeCurrent = 0;

    properties.forEach((property, index) => {
      cumulativePurchase += property.purchasePrice || 0;
      cumulativeCurrent += property.currentEstimate || property.purchasePrice || 0;
      
      const date = property.createdAt || new Date();
      valueData.push({
        date: date.toISOString().split('T')[0],
        purchaseValue: cumulativePurchase,
        currentValue: cumulativeCurrent,
      });
    });

    // Данные для графика распределения по статусам
    const statusDistribution = {
      rental: properties.filter(p => p.status === 'rental').length,
      under_construction: properties.filter(p => p.status === 'under_construction').length,
      closed: properties.filter(p => p.status === 'closed').length,
    };

    // Данные для графика распределения по регионам (топ-5)
    const regionCounts: Record<string, number> = {};
    properties.forEach(p => {
      if (p.region) {
        regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
      }
    });
    const topRegions = Object.entries(regionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([region, count]) => ({ region, count }));

    return {
      valueHistory: valueData,
      statusDistribution,
      topRegions,
    };
  }
}

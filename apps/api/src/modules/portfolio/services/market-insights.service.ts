import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketInsightsService {
  async getMarketData(region: string) {
    return {
      region,
      averagePrice: 0,
      trends: [],
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Price } from '../entities/price.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import * as moment from 'moment';
import { BlockchainService } from 'src/blockchain/blockchain.service';
interface PriceData {
  name: string;
  usd_price: string;
}

interface PricePayload {
  eth: PriceData;
  polygon: PriceData;
}

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private blockChainService: BlockchainService,
  ) {}
  private readonly logger = new Logger(PricesService.name);
  private readonly feePercentage = 0.03 / 100;

  async getPrice(): Promise<object> {
    const data = await this.priceRepository.find();
    return data;
  }

  async savePrice(payload: PricePayload): Promise<object> {
    const { eth, polygon } = payload;
    await this.priceRepository.save({
      name: eth.name,
      price: Number(eth.usd_price),
      created_at: new Date(),
    });
    await this.priceRepository.save({
      name: polygon.name,
      price: Number(polygon.usd_price),
      created_at: new Date(),
    });
    return { success: true };
  }

  async getHourlyPrices(): Promise<object> {
    const arr = [];
    arr.push(this.getHourlyPricesChain('Ethereum'));
    arr.push(this.getHourlyPricesChain('Polygon'));

    const result = await Promise.all(arr);
    return {
      eth: result[0],
      polygon: result[1],
    };
  }

  async getHourlyPricesChain(chain: string): Promise<any[]> {
    const now = new Date();
    const startOfHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      0,
      0,
    );

    const startTime = new Date(startOfHour.getTime() - 24 * 60 * 60 * 1000);

    const prices = await this.priceRepository.find({
      where: {
        created_at: MoreThanOrEqual(startTime),
        name: chain,
      },
      order: {
        created_at: 'ASC',
      },
    });
    const hourlyData: Record<string, { price: number; timestamp: Date }> = {};
    prices.forEach((data) => {
      if (data.created_at < startOfHour) {
        const hourKey = new Date(data.created_at).setMinutes(0, 0, 0);
        if (!hourlyData[hourKey] || data.price < hourlyData[hourKey].price) {
          hourlyData[hourKey] = {
            price: data.price,
            timestamp: data.created_at,
          };
        }
      }
    });
    return Object.entries(hourlyData).map(([key, value]) => ({
      timestamp: moment(new Date(Number(key))).format('YYYY-MM-DD HH:mm:ss'),
      price: value.price,
    }));
  }
  async getSwapRate(
    ethAmount: number,
  ): Promise<{ btcAmount: number; ethFee: number; dollarFee: number }> {
    const chainData = await this.blockChainService.fetchBtcEthPrice();
    const { eth, bitcoin } = chainData;
    const ethPrice = Number(eth.usd_price);
    const bitcoinPrice = Number(bitcoin.usd_price);
    const ethAmountInUsd = ethAmount * ethPrice;
    const btcAmount = ethAmountInUsd / bitcoinPrice;
    const ethFee = ethAmount * this.feePercentage;
    const dollarFee = ethFee * ethPrice;
    return { btcAmount, ethFee, dollarFee };
  }

  async getPriceLastHour(): Promise<any> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    this.logger.log(`last hour : ${oneHourAgo}`);
    const eth: Price[] = await this.priceRepository.find({
      where: {
        created_at: LessThanOrEqual(oneHourAgo),
        name: 'Ethereum',
      },
      order: {
        created_at: 'DESC',
      },
      take: 1,
    });
    const polygon: Price[] = await this.priceRepository.find({
      where: {
        created_at: LessThanOrEqual(oneHourAgo),
        name: 'Polygon',
      },
      order: {
        created_at: 'DESC',
      },
      take: 1,
    });
    if (!(eth[0] && polygon[0])) {
      return null;
    }
    return { eth: eth[0], polygon: polygon[0] };
  }
}

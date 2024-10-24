import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);

  async apiRequest() {
    const options = {
      method: 'GET',
      url: 'https://deep-index.moralis.io/api/v2.2/market-data/global/market-cap',
      headers: {
        'X-API-Key': process.env.API_KEY,
      },
    };
    return await axios.request(options);
  }

  async fetchPrices(): Promise<any> {
    this.logger.log('Fetching prices...');

    try {
      const response = await this.apiRequest();
      const data = response.data;

      const eth = data.find((x) => x.name === 'Ethereum');
      const polygon = data.find((x) => x.name === 'Polygon');

      if (!eth || !polygon) {
        this.logger.warn('Could not find Ethereum or Polygon data.');
        return { eth: null, polygon: null };
      }

      this.logger.log(`Ethereum price: ${eth.usd_price}`);
      this.logger.log(`Polygon price: ${Number(polygon.usd_price)}`);

      return { eth, polygon };
    } catch (error) {
      this.logger.error('Error fetching prices:', error.message);
      throw new Error('Could not fetch prices');
    }
  }

  async fetchBtcEthPrice(): Promise<{
    eth: { usd_price: string };
    bitcoin: { usd_price: string };
  }> {
    this.logger.log('Fetching prices...');
    try {
      const response = await this.apiRequest();
      const data = response.data;

      const eth = data.find((x) => x.name === 'Ethereum');
      const bitcoin = data.find((x) => x.name === 'Bitcoin');

      if (!eth || !bitcoin) {
        this.logger.warn('Could not find Ethereum or Btc data.');
        return { eth: null, bitcoin: null };
      }

      this.logger.log(`Ethereum price: ${eth.usd_price}`);
      this.logger.log(`Btc price: ${Number(bitcoin.usd_price)}`);

      return { eth, bitcoin };
    } catch (error) {
      this.logger.error('Error fetching prices:', error.message);
      throw new Error('Could not fetch prices');
    }
  }
}

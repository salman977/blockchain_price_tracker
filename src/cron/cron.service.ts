import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AlertService } from 'src/alert/alert.service';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { MailService } from 'src/mail/mail.service';
import { PricesService } from 'src/prices/prices.service';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);
  private readonly defaultMail: string = process.env.DEFAULT_MAIL;
  private readonly defaultSubject: string = process.env.DEFAULT_SUBJECT;
  constructor(
    private priceService: PricesService,
    private blockchainService: BlockchainService,
    private mailService: MailService,
    private alertService: AlertService,
  ) {}

  onModuleInit() {
    this.logger.log('Running First Time For Storing Data.');
    this.savePrices();
  }

  @Cron('*/5 * * * *')
  async savePrices() {
    const fetchedPrices = await this.blockchainService.fetchPrices();
    this.savePrice(fetchedPrices);
    this.checkPrices(fetchedPrices);
    this.checkAlerts({
      Ethereum: fetchedPrices.eth,
      Polygon: fetchedPrices.polygon,
    });
  }

  async savePrice(payload) {
    await this.priceService.savePrice(payload);
  }

  async checkPrices(payload) {
    const oldPrice = await this.priceService.getPriceLastHour();
    if (!oldPrice) {
      this.logger.log('no record found for old prices :', oldPrice);
      return;
    }
    this.logger.log(`old price : ${JSON.stringify(oldPrice)}`);
    const { eth: oldEth, polygon: oldPolygon } = oldPrice;
    const { eth, polygon } = payload;
    const ethPriceChange =
      ((Number(eth.usd_price) - oldEth.price) / oldEth.price) * 100;
    const polygonPriceChange =
      ((Number(polygon.usd_price) - oldPolygon.price) / oldPolygon.price) * 100;
    this.logger.log(
      `eth old price ${oldEth.price} current  ${eth.usd_price}  polygon old price ${oldPolygon.price} current  ${polygon.usd_price}  `,
    );
    this.logger.log(
      `eth price change percentage ${ethPriceChange}  and polygon price change percentage  ${polygonPriceChange} `,
    );
    if (ethPriceChange > 3) {
      await this.mailService.sendMail({
        email: this.defaultMail,
        message: `ETH Price increased 3% from last hour`,
        subject: this.defaultSubject,
      });
    }
    if (polygonPriceChange > 3) {
      await this.mailService.sendMail({
        email: this.defaultMail,
        message: `Polygon Price increased 3% from last hour`,
        subject: this.defaultSubject,
      });
    }
  }

  async checkAlerts(payload) {
    const alerts = await this.alertService.fetchAllAlerts();
    this.logger.log(`alerts : ${JSON.stringify(alerts)}`);
    for (const { chain, threshold, email } of alerts) {
      const foundChain = payload[chain];
      if (foundChain) {
        const { usd_price } = foundChain;
        this.logger.log(
          `chain ${chain} checking threshold ${threshold} and current price ${Math.ceil(usd_price)}`,
        );
        if (Math.ceil(usd_price) == threshold) {
          this.mailService.sendMail({
            email,
            message: `threshold met for chain ${chain}`,
            subject: `Chain Threshold notification`,
          });
        }
      }
    }
  }
}

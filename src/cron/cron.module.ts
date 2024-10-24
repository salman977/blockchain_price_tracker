import { Module } from '@nestjs/common';
import { PricesModule } from 'src/prices/prices.module';
import { CronService } from './cron.service';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { MailModule } from 'src/mail/mail.module';
import { AlertModule } from 'src/alert/alert.module';

@Module({
  imports: [PricesModule, BlockchainModule, MailModule, AlertModule],
  providers: [CronService],
})
export class CronModule {}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PricesService } from './prices.service';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private priceService: PricesService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current price data' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved current prices.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Ethereum' },
          price: { type: 'string', example: '0.675' },
          created_at: { type: 'date', example: '2024-10-24T10:34:00.656Z' },
        },
      },
    },
  })
  async getData() {
    return this.priceService.getPrice();
  }

  @Get('/hourly')
  @ApiOperation({ summary: 'Get the hourly price data' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved hourly prices.',
    type: Object,
  })
  async getDataHourly() {
    return this.priceService.getHourlyPrices();
  }

  @Get('/swap-rate')
  @ApiQuery({
    name: 'ethAmount',
    type: 'number',
    example: 1.5,
    description: 'The amount of Ethereum (ETH)',
  })
  @ApiResponse({
    status: 200,
    description: 'Swap rate from ETH to BTC, including the total fees',
    schema: {
      type: 'object',
      properties: {
        btcAmount: { type: 'number', example: 0.075 },
        ethFee: { type: 'number', example: 0.045 },
        dollarFee: { type: 'number', example: 80 },
      },
    },
  })
  async getSwapRate(
    @Query('ethAmount') ethAmount: number,
  ): Promise<{ btcAmount: number; ethFee: number; dollarFee: number }> {
    return this.priceService.getSwapRate(ethAmount);
  }
}

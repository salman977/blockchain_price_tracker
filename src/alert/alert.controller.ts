import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AlertService } from './alert.service';
import { Alert } from '../entities/alert.entity';

enum Chain {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
}

@ApiTags('Alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiBody({
    description: 'Payload for creating a new alert',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        threshold: { type: 'number', example: 100 },
        chain: {
          type: 'string',
          example: 'Ethereum',
          enum: [Chain.Ethereum, Chain.Polygon],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The alert has been successfully created.',
    type: Alert,
  })
  async createAlert(
    @Body() body: { email: string; threshold: number; chain: Chain },
  ): Promise<Alert> {
    return this.alertService.setAlert(body.email, body.threshold, body.chain);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all alert thresholds' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all alerts.',
    type: [Alert],
  })
  async getAllAlerts(): Promise<Alert[]> {
    return this.alertService.fetchAllAlerts();
  }
}

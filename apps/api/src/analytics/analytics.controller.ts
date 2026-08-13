import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('v1/qr/:id/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  async getSummary(@CurrentUser() user: any, @Param('id') qrCodeId: string) {
    const data = await this.analyticsService.getSummary(qrCodeId, user.id);
    return { success: true, data };
  }

  @Get('timeseries')
  async getTimeseries(
    @CurrentUser() user: any,
    @Param('id') qrCodeId: string,
    @Query('days') days?: string
  ) {
    const data = await this.analyticsService.getTimeseries(qrCodeId, user.id, days ? parseInt(days) : 30);
    return { success: true, data };
  }

  @Get('devices')
  async getDevices(@CurrentUser() user: any, @Param('id') qrCodeId: string) {
    const data = await this.analyticsService.getDevices(qrCodeId, user.id);
    return { success: true, data };
  }
}

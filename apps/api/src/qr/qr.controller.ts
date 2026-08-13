import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('v1/qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() createQrDto: CreateQrDto) {
    const qr = await this.qrService.create(user.id, createQrDto);
    return { success: true, data: qr };
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    const qrs = await this.qrService.findAllForUser(user.id);
    return { success: true, data: qrs };
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    const qr = await this.qrService.findOne(id, user.id);
    return { success: true, data: qr };
  }

  @Patch(':id')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateQrDto: UpdateQrDto) {
    const qr = await this.qrService.update(id, user.id, updateQrDto);
    return { success: true, data: qr };
  }

  @Delete(':id')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    await this.qrService.remove(id, user.id);
    return { success: true, data: { deleted: true } };
  }

  @Get(':id/image')
  async generateImage(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Query('format') format: 'png' | 'svg' = 'png'
  ) {
    const image = await this.qrService.generateImage(id, user.id, format);
    return { success: true, data: { image, format } };
  }
}

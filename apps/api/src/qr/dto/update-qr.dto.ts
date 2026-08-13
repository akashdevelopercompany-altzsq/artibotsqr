import { IsUrl, IsString, IsOptional, IsEnum } from 'class-validator';

export enum QRStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  BLOCKED = 'BLOCKED'
}
export class UpdateQrDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl({ require_protocol: true, allow_underscores: true })
  @IsOptional()
  destinationUrl?: string;

  @IsEnum(QRStatus)
  @IsOptional()
  status?: QRStatus;
}

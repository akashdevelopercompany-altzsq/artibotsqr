import { IsUrl, IsString, IsOptional, IsEnum } from 'class-validator';

export enum QRType {
  WEBSITE = 'WEBSITE',
  PRODUCT = 'PRODUCT',
  PAYMENT = 'PAYMENT',
  CUSTOM = 'CUSTOM',
  CAMPAIGN = 'CAMPAIGN',
  UPI = 'UPI'
}
export class CreateQrDto {
  @IsString()
  name!: string;

  @IsUrl({ require_protocol: true, allow_underscores: true })
  destinationUrl!: string;

  @IsEnum(QRType)
  @IsOptional()
  type?: QRType;
  
  @IsString()
  @IsOptional()
  organizationId?: string; // If left blank, use user's default org
}

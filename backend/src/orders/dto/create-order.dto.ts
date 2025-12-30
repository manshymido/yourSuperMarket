import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  addressId!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

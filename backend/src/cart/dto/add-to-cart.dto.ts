import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity!: number;
}

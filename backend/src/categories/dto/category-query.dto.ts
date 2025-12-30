import { IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryQueryDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeInactive?: boolean;
}

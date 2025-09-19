import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ default: 10, example: 10, description: 'Limit' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}

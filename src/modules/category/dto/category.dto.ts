import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Unique category name' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Devices and gadgets', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class GetCategoriesDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'electronics',
    description: 'Search by slug',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Electronics',
    description: 'Search by name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

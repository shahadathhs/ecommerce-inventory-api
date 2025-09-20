import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15', description: 'Product name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Latest Apple iPhone model',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsDecimal()
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Category unique identifier (UUID v4)',
  })
  @IsUUID('4', { message: 'Category ID must be a valid UUID v4' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Optional product image',
  })
  image: Express.Multer.File;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'iPhone 15', description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Latest Apple iPhone model',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 999.99, description: 'Product price' })
  @Transform(({ value }) => {
    if (
      value === 'null' ||
      value === 'undefined' ||
      value?.toString().trim() === ''
    ) {
      return undefined;
    }
    return value;
  })
  @IsOptional()
  @IsDecimal()
  price?: number;

  @ApiPropertyOptional({ example: 50, description: 'Available stock' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Category unique identifier (UUID v4)',
  })
  @Transform(({ value }) => {
    if (
      value === 'null' ||
      value === 'undefined' ||
      value?.toString().trim() === ''
    ) {
      return undefined;
    }
    return value;
  })
  @IsOptional()
  @IsUUID('4', { message: 'Category ID must be a valid UUID v4' })
  categoryId?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Optional product image',
  })
  @IsOptional()
  image?: Express.Multer.File;
}

export class GetProductsDto extends PaginationDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filter by Category ID (UUID v4)',
  })
  @IsOptional()
  @IsString({ message: 'Category ID must be a string' })
  categoryId?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Minimum price filter',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Minimum price cannot be negative' })
  minPrice?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Maximum price filter',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0, { message: 'Maximum price cannot be negative' })
  maxPrice?: number;
}

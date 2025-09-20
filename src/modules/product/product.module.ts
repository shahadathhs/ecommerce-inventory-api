import { FileService } from '@/lib/file/file.service';
import { Module } from '@nestjs/common';
import { CategoryRepository } from '../category/repo/category.repository';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repo/product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    CategoryRepository,
    FileService,
  ],
})
export class ProductModule {}

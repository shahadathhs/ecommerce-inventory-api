import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto,
} from '../dto/product.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }

  async findAndCount(query: GetProductsDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    const where = this.buildProductWhere({
      categoryId: query.categoryId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });

    return await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          imageFile: true,
        },
        orderBy: { price: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        imageFile: true,
      },
    });
  }

  update(id: string, data: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  // Helper
  private buildProductWhere(filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    return where;
  }
}

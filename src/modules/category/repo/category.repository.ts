import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto & { slug: string }): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async findBySlugOrName(slug?: string, name?: string, skip = 0, take = 10) {
    const where = this.buildSlugOrNameFilter(slug, name);

    return this.prisma.category.findMany({
      where,
      skip,
      take,
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async countBySlugOrName(slug?: string, name?: string): Promise<number> {
    const where = this.buildSlugOrNameFilter(slug, name);

    return this.prisma.category.count({ where });
  }

  async update(
    id: string,
    data: UpdateCategoryDto & { slug?: string },
  ): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }

  async hasProducts(id: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) return false;

    return category?._count?.products > 0;
  }

  private buildSlugOrNameFilter(slug?: string, name?: string) {
    const where: any = {};

    if (slug) where.slug = { contains: slug, mode: 'insensitive' };
    if (name) where.name = { contains: name, mode: 'insensitive' };

    return where;
  }
}

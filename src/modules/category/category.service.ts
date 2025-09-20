import { AppError } from '@/common/error/handle-error.app';
import { HandleError } from '@/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@/common/utils/response.utils';
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import {
  CreateCategoryDto,
  GetCategoriesDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { CategoryRepository } from './repo/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  @HandleError('Failed to create category', 'Category')
  async create(dto: CreateCategoryDto): Promise<TResponse<any>> {
    const slug = slugify(dto.name, { lower: true, strict: true });
    const category = await this.repo.create({ ...dto, slug });

    return successResponse(category, 'Category created successfully');
  }

  @HandleError('Failed to fetch categories', 'Categories')
  async findAll(query: GetCategoriesDto): Promise<TPaginatedResponse<any>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findAndCountBySlugOrName(
      query.slug,
      query.name,
      skip,
      limit,
    );

    return successPaginatedResponse(
      items,
      {
        page,
        limit,
        total,
      },
      'Categories fetched successfully',
    );
  }

  @HandleError('Failed to fetch category', 'Category')
  async findOne(id: string): Promise<TResponse<any>> {
    const category = await this.repo.findById(id);
    if (!category) throw new AppError(404, 'Category not found');

    return successResponse(category, 'Category fetched successfully');
  }

  @HandleError('Failed to update category', 'Category')
  async update(id: string, dto: UpdateCategoryDto): Promise<TResponse<any>> {
    const category = await this.findOne(id);
    let slug: string | undefined;
    if (dto.name) slug = slugify(dto.name, { lower: true, strict: true });

    const updatedCategory = await this.repo.update(category.data.id, {
      ...dto,
      slug,
    });

    return successResponse(updatedCategory, 'Category updated successfully');
  }

  @HandleError('Failed to delete category', 'Category')
  async remove(id: string): Promise<TResponse<any>> {
    await this.findOne(id);

    const hasProducts = await this.repo.hasProducts(id);
    if (hasProducts) {
      throw new AppError(
        409,
        'Category has linked products and cannot be deleted',
      );
    }
    await this.repo.delete(id);

    return successResponse(null, 'Category deleted successfully');
  }
}

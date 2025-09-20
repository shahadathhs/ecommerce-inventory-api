import { AppError } from '@/common/error/handle-error.app';
import { HandleError } from '@/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@/common/utils/response.utils';
import { FileService } from '@/lib/file/file.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoryRepository } from '../category/repo/category.repository';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductRepository } from './repo/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly repo: ProductRepository,
    private readonly fileService: FileService,
    private readonly categoryRepo: CategoryRepository,
  ) {}

  @HandleError('Failed to create product', 'Product')
  async create(
    dto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<TResponse<any>> {
    if (!file) {
      throw new AppError(400, 'Product image is required');
    }

    // * check if category exists
    const category = await this.categoryRepo.findById(dto.categoryId);
    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    const uploaded = await this.fileService.processUploadedFile(
      file,
      'product',
    );

    const product = await this.repo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      category: {
        connect: {
          id: dto.categoryId,
        },
      },
      imageFile: {
        connect: {
          id: uploaded.id,
        },
      },
    });

    return successResponse(product, 'Product created successfully');
  }

  @HandleError('Failed to fetch products', 'Products')
  async findAll(query: GetProductsDto): Promise<TPaginatedResponse<any>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;

    const [items, total] = await this.repo.findAndCount({
      categoryId: query.categoryId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      skip: (page - 1) * limit,
      take: limit,
    });

    return successPaginatedResponse(
      items,
      {
        page,
        limit,
        total,
      },
      'Products fetched successfully',
    );
  }

  @HandleError('Failed to fetch product', 'Product')
  async findOne(id: string): Promise<TResponse<any>> {
    const product = await this.repo.findById(id);
    if (!product) throw new AppError(404, 'Product not found');

    return successResponse(product, 'Product fetched successfully');
  }

  @HandleError('Failed to update product', 'Product')
  async update(
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<TResponse<any>> {
    const { data: product } = await this.findOne(id);

    let imageFile;
    if (file) {
      if (product.imageFileId) {
        await this.fileService.remove(product.imageFileId);
      }
      const uploaded = await this.fileService.processUploadedFile(
        file,
        'product',
      );
      imageFile = { connect: { id: uploaded.id } };
    }

    const updateData: Prisma.ProductUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.categoryId !== undefined && {
        category: { connect: { id: dto.categoryId } },
      }),
      ...(imageFile && { imageFile }),
    };

    const updatedProduct = await this.repo.update(id, updateData);

    return successResponse(updatedProduct, 'Product updated successfully');
  }

  async delete(id: string) {
    const { data: product } = await this.findOne(id);

    if (product.imageFileId) {
      await this.fileService.remove(product.imageFileId);
    }

    await this.repo.delete(id);

    return successResponse(null, 'Product deleted successfully');
  }
}

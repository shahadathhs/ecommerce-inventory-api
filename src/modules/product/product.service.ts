import { AppError } from '@/common/error/handle-error.app';
import { HandleError } from '@/common/error/handle-error.decorator';
import { successResponse, TResponse } from '@/common/utils/response.utils';
import { FileService } from '@/lib/file/file.service';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../category/repo/category.repository';
import { CreateProductDto } from './dto/product.dto';
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
}

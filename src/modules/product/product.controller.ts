import { JwtAuthGuard } from '@/common/jwt/jwt.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB Max
      fileFilter: (req, file, callback) => {
        // Accept only image mimetype
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.create(dto, file);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  findAll(@Query() query: GetProductsDto) {
    return this.productService.findAll(query);
  }

  @ApiOperation({ summary: 'Get product by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Update product' })
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB Max
      fileFilter: (req, file, callback) => {
        // Accept only image mimetype
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productService.update(id, dto, file);
  }

  @ApiOperation({ summary: 'Delete product' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}

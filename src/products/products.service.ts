import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const exists = await this.repo.findOne({ where: { sku: dto.sku } });
    if (exists) throw new ConflictException('SKU already exists');

    const product = this.repo.create({
      sku: dto.sku,
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      isActive: dto.isActive ?? true,
    });

    return this.repo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    if (dto.sku && dto.sku !== product.sku) {
      const skuTaken = await this.repo.findOne({ where: { sku: dto.sku } });
      if (skuTaken) throw new ConflictException('SKU already exists');
    }

    Object.assign(product, {
      sku: dto.sku ?? product.sku,
      name: dto.name ?? product.name,
      description: dto.description ?? product.description,
      price: dto.price ?? product.price,
      isActive: dto.isActive ?? product.isActive,
    });

    return this.repo.save(product);
  }

  async listAdmin(): Promise<ProductEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async listPublic(): Promise<ProductEntity[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}

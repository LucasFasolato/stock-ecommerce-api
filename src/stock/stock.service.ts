import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from '../products/product.entity';
import { StockMovementEntity } from './stock-movement.entity';
import { StockMovementType } from './stock-movement-type.enum';

@Injectable()
export class StockService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ProductEntity)
    private readonly productsRepo: Repository<ProductEntity>,
    @InjectRepository(StockMovementEntity)
    private readonly movementsRepo: Repository<StockMovementEntity>,
  ) {}

  async stockIn(params: {
    productId: string;
    quantity: number;
    note?: string;
    createdByUserId?: string;
    referenceId?: string;
  }) {
    return this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(ProductEntity, {
        where: { id: params.productId },
      });
      if (!product) throw new NotFoundException('Product not found');

      if (params.quantity <= 0)
        throw new BadRequestException('Quantity must be > 0');

      product.stock += params.quantity;

      const movement = manager.create(StockMovementEntity, {
        product,
        type: StockMovementType.IN,
        quantity: params.quantity,
        note: params.note ?? null,
        createdByUserId: params.createdByUserId ?? null,
        referenceId: params.referenceId ?? null,
      });

      await manager.save(product);
      await manager.save(movement);

      return {
        productId: product.id,
        stock: product.stock,
        movementId: movement.id,
      };
    });
  }

  async stockOut(params: {
    productId: string;
    quantity: number;
    note?: string;
    createdByUserId?: string;
    referenceId?: string;
  }) {
    return this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(ProductEntity, {
        where: { id: params.productId },
      });
      if (!product) throw new NotFoundException('Product not found');

      if (params.quantity <= 0)
        throw new BadRequestException('Quantity must be > 0');
      if (product.stock < params.quantity)
        throw new BadRequestException('Insufficient stock');

      product.stock -= params.quantity;

      const movement = manager.create(StockMovementEntity, {
        product,
        type: StockMovementType.OUT,
        quantity: params.quantity,
        note: params.note ?? null,
        createdByUserId: params.createdByUserId ?? null,
        referenceId: params.referenceId ?? null,
      });

      await manager.save(product);
      await manager.save(movement);

      return {
        productId: product.id,
        stock: product.stock,
        movementId: movement.id,
      };
    });
  }

  async adjust(params: {
    productId: string;
    newStock: number;
    note?: string;
    createdByUserId?: string;
    referenceId?: string;
  }) {
    return this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(ProductEntity, {
        where: { id: params.productId },
      });
      if (!product) throw new NotFoundException('Product not found');

      if (params.newStock < 0)
        throw new BadRequestException('newStock must be >= 0');

      const diff = params.newStock - product.stock;
      product.stock = params.newStock;

      const movement = manager.create(StockMovementEntity, {
        product,
        type: StockMovementType.ADJUST,
        quantity: Math.abs(diff), // guardamos magnitud
        note: params.note ?? null,
        createdByUserId: params.createdByUserId ?? null,
        referenceId: params.referenceId ?? null,
      });

      await manager.save(product);
      await manager.save(movement);

      return {
        productId: product.id,
        stock: product.stock,
        movementId: movement.id,
      };
    });
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { ProductEntity } from '../products/product.entity';
import { OrderStatus } from './order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { ForbiddenException } from '@nestjs/common';
import { StockService } from '../stock/stock.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OrderEntity)
    private readonly ordersRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly itemsRepo: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepo: Repository<ProductEntity>,
    private readonly stockService: StockService,
  ) {}

  async create(dto: CreateOrderDto, createdByUserId: string | null) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must have at least 1 item');
    }

    return this.dataSource.transaction(async (manager) => {
      // 1) crear y guardar la order (sin items)
      const order = manager.create(OrderEntity, {
        status: OrderStatus.SUBMITTED,
        customerName: dto.customerName ?? null,
        customerEmail: dto.customerEmail ?? null,
        customerPhone: dto.customerPhone ?? null,
        createdByUserId,
        subtotal: 0,
        total: 0,
      });

      const savedOrder = await manager.save(order);

      // 2) crear items ya con order persistida
      let subtotal = 0;

      const itemsToSave: OrderItemEntity[] = [];

      for (const it of dto.items) {
        const product = await manager.findOne(ProductEntity, {
          where: { id: it.productId },
        });
        if (!product || !product.isActive) {
          throw new BadRequestException(`Invalid productId: ${it.productId}`);
        }

        const unitPrice = product.price;
        const lineTotal = unitPrice * it.quantity;
        subtotal += lineTotal;

        const item = manager.create(OrderItemEntity, {
          order: savedOrder,
          product,
          quantity: it.quantity,
          unitPrice,
          lineTotal,
        });

        itemsToSave.push(item);
      }

      await manager.save(itemsToSave);

      // 3) actualizar totales
      savedOrder.subtotal = subtotal;
      savedOrder.total = subtotal;
      await manager.save(savedOrder);

      // 4) devolver con relaciones cargadas
      const full = await manager.findOne(OrderEntity, {
        where: { id: savedOrder.id },
        relations: ['items', 'items.product'],
      });

      return full;
    });
  }

  async confirm(orderId: string, adminUserId: string) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(OrderEntity, {
        where: { id: orderId },
        relations: ['items', 'items.product'],
      });

      if (!order) throw new ForbiddenException('Order not found');
      if (order.status !== OrderStatus.SUBMITTED) {
        throw new ForbiddenException('Only SUBMITTED orders can be confirmed');
      }

      // 1) Validar stock suficiente
      for (const item of order.items) {
        if (item.product.stock < item.quantity) {
          throw new ForbiddenException(
            `Insufficient stock for product ${item.product.name}`,
          );
        }
      }

      // 2) Descontar stock (uno por uno, pero todo dentro de la tx)
      for (const item of order.items) {
        await this.stockService.stockOut({
          productId: item.product.id,
          quantity: item.quantity,
          note: `Order ${order.id} confirmed`,
          createdByUserId: adminUserId,
          referenceId: order.id,
        });
      }

      // 3) Cambiar estado
      order.status = OrderStatus.CONFIRMED;
      await manager.save(order);

      return order;
    });
  }

  async cancel(orderId: string) {
    const order = await this.ordersRepo.findOne({ where: { id: orderId } });

    if (!order) throw new ForbiddenException('Order not found');

    if (order.status !== OrderStatus.SUBMITTED) {
      throw new ForbiddenException('Only SUBMITTED orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    return this.ordersRepo.save(order);
  }

  async listAdmin() {
    return this.ordersRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async listAdminFiltered(query: { status?: OrderStatus }) {
    return this.ordersRepo.find({
      where: query.status ? { status: query.status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async getByIdAdmin(id: string) {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}

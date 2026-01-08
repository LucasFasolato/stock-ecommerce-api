import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../products/product.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  order!: OrderEntity;

  @Index()
  @ManyToOne(() => ProductEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  product!: ProductEntity;

  @Column({ type: 'int' })
  quantity!: number;

  // precio unitario al momento de la proforma (snapshot)
  @Column({ type: 'float' })
  unitPrice!: number;

  @Column({ type: 'float' })
  lineTotal!: number;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.enum';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', default: OrderStatus.SUBMITTED })
  status!: OrderStatus;

  // Datos simples de cliente (para web checkout/proforma)
  @Column({ type: 'varchar', nullable: true })
  customerName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  customerEmail!: string | null;

  @Column({ type: 'varchar', nullable: true })
  customerPhone!: string | null;

  // Totales (float como pediste)
  @Column({ type: 'float', default: 0 })
  subtotal!: number;

  @Column({ type: 'float', default: 0 })
  total!: number;

  // Quién la creó (admin o user interno). Para público puede quedar null.
  @Column({ type: 'uuid', nullable: true })
  createdByUserId!: string | null;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: true,
  })
  items!: OrderItemEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

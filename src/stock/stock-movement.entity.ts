import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { StockMovementType } from './stock-movement-type.enum';

@Entity('stock_movements')
export class StockMovementEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => ProductEntity, { nullable: false, onDelete: 'RESTRICT' })
  product!: ProductEntity;

  @Column({ type: 'varchar' })
  type!: StockMovementType;

  // Siempre positivo. El tipo define si suma/resta/ajusta.
  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  // Quién lo hizo (userId del JWT)
  @Column({ type: 'uuid', nullable: true })
  createdByUserId!: string | null;

  // Para enlazar a proforma/pedido más adelante
  @Column({ type: 'uuid', nullable: true })
  referenceId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}

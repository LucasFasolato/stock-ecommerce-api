import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementEntity } from './stock-movement.entity';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { ProductEntity } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovementEntity, ProductEntity])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}

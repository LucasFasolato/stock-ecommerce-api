import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../order-status.enum';

export class OrderQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

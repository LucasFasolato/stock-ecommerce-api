import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class StockMoveDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  note?: string;

  // para enlazar a proforma en el futuro
  @IsOptional()
  @IsUUID()
  referenceId?: string;
}

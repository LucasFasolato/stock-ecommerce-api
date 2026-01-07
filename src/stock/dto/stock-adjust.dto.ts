import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class StockAdjustDto {
  @IsUUID()
  productId!: string;

  // stock final deseado
  @IsInt()
  @Min(0)
  newStock!: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsUUID()
  referenceId?: string;
}

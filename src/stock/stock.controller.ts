import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { StockService } from './stock.service';
import { StockMoveDto } from './dto/stock-move.dto';
import { StockAdjustDto } from './dto/stock-adjust.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user-role.enum';

type AuthUser = { userId: string; email: string; role: UserRole };

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('in')
  stockIn(@Req() req: Request, @Body() dto: StockMoveDto) {
    const user = req.user as AuthUser;

    return this.stockService.stockIn({
      productId: dto.productId,
      quantity: dto.quantity,
      note: dto.note,
      referenceId: dto.referenceId,
      createdByUserId: user.userId,
    });
  }

  @Post('out')
  stockOut(@Req() req: Request, @Body() dto: StockMoveDto) {
    const user = req.user as AuthUser;

    return this.stockService.stockOut({
      productId: dto.productId,
      quantity: dto.quantity,
      note: dto.note,
      referenceId: dto.referenceId,
      createdByUserId: user.userId,
    });
  }

  @Post('adjust')
  adjust(@Req() req: Request, @Body() dto: StockAdjustDto) {
    const user = req.user as AuthUser;

    return this.stockService.adjust({
      productId: dto.productId,
      newStock: dto.newStock,
      note: dto.note,
      referenceId: dto.referenceId,
      createdByUserId: user.userId,
    });
  }
}

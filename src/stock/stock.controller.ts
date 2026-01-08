import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { StockService } from './stock.service';
import { StockMoveDto } from './dto/stock-move.dto';
import { StockAdjustDto } from './dto/stock-adjust.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user-role.enum';

// Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

type AuthUser = { userId: string; email: string; role: UserRole };

@ApiTags('Stock')
@ApiBearerAuth()
@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('in')
  @ApiOperation({ summary: 'Stock IN (increase product stock)' })
  @ApiResponse({ status: 201, description: 'Stock increased' })
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
  @ApiOperation({ summary: 'Stock OUT (decrease product stock)' })
  @ApiResponse({ status: 201, description: 'Stock decreased' })
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
  @ApiOperation({ summary: 'Adjust stock to a specific value' })
  @ApiResponse({ status: 201, description: 'Stock adjusted' })
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

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user-role.enum';

// Swagger
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

type AuthUser = { userId: string; email: string; role: UserRole };

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ======================
  // Público
  // ======================

  @Post()
  @ApiOperation({
    summary: 'Create public proforma (checkout without payment)',
  })
  @ApiResponse({ status: 201, description: 'Proforma created' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto, null);
  }

  // ======================
  // Admin (acciones fijas)
  // ======================

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create proforma as admin (stores creator user)' })
  @ApiResponse({ status: 201, description: 'Admin proforma created' })
  createAdmin(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const user = req.user as AuthUser;
    return this.ordersService.create(dto, user.userId);
  }

  // ======================
  // Admin (acciones por ID)
  // ======================

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Confirm proforma and discount stock' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  @ApiResponse({ status: 200, description: 'Order confirmed' })
  confirm(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { userId: string };
    return this.ordersService.confirm(id, user.userId);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel submitted proforma' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  @ApiResponse({ status: 200, description: 'Order cancelled' })
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  // ======================
  // Admin (queries)
  // ======================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List orders with optional filters' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['SUBMITTED', 'CONFIRMED', 'CANCELLED'],
  })
  @ApiResponse({ status: 200, description: 'Orders list' })
  listAdmin(@Query() query: OrderQueryDto) {
    return this.ordersService.listAdminFiltered(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get order detail by id' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  @ApiResponse({ status: 200, description: 'Order detail' })
  getById(@Param('id') id: string) {
    return this.ordersService.getByIdAdmin(id);
  }
}

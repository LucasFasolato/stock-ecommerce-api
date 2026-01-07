import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersSeed implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin123';

    const exists = await this.usersService.findByEmail(adminEmail);
    if (exists) return;

    const hash = await bcrypt.hash(adminPassword, 10);

    await this.usersService.create({
      email: adminEmail,
      passwordHash: hash,
      role: UserRole.ADMIN,
    });

    console.log('✅ Admin user seeded');
  }
}

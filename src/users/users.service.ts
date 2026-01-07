import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    isActive?: boolean;
    role?: UserRole;
  }): Promise<UserEntity> {
    const user = this.repo.create({
      email: data.email,
      passwordHash: data.passwordHash,
      isActive: data.isActive ?? true,
      role: data.role ?? UserRole.OPERATOR,
    });
    return this.repo.save(user);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 'user-1',
      name: 'Administrador',
      email: 'admin@recio.com',
      role: 'admin',
      status: 'active',
      orderCount: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-2',
      name: 'Cliente Demo',
      email: 'customer@recio.com',
      role: 'customer',
      status: 'active',
      orderCount: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-3',
      name: 'Maria Lopez',
      email: 'maria@example.com',
      role: 'customer',
      status: 'active',
      orderCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-4',
      name: 'Carlos Ruiz',
      email: 'carlos@example.com',
      role: 'customer',
      status: 'inactive',
      orderCount: 1,
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(role?: string, status?: string): User[] {
    let result = [...this.users];

    if (role) {
      result = result.filter((u) => u.role === role);
    }

    if (status) {
      result = result.filter((u) => u.status === status);
    }

    return result;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: `user-${this.users.length + 1}`,
      ...createUserDto,
      orderCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    const updatedUser = { ...user, ...updateUserDto };
    const index = this.users.findIndex((u) => u.id === id);
    this.users[index] = updatedUser;
    return updatedUser;
  }

  remove(id: string): { deleted: boolean } {
    this.findOne(id);
    this.users = this.users.filter((u) => u.id !== id);
    return { deleted: true };
  }
}

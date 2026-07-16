import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
}

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@recio.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      id: '2',
      name: 'Cliente Demo',
      email: 'customer@recio.com',
      password: 'customer123',
      role: 'customer',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  register(registerDto: RegisterDto) {
    const existingUser = this.users.find((u) => u.email === registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('El correo ya esta registrado');
    }

    const newUser: User = {
      id: (this.users.length + 1).toString(),
      ...registerDto,
      role: 'customer',
    };

    this.users.push(newUser);

    const { password, ...result } = newUser;
    return result;
  }

  login(loginDto: LoginDto) {
    const user = this.users.find((u) => u.email === loginDto.email);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  getProfile(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password, ...result } = user;
    return result;
  }
}

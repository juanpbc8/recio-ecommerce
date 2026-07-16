import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, IsIn, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Maria Lopez', description: 'Nombre completo del usuario' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'maria@example.com', description: 'Correo electronico' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contrasena' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'customer', description: 'Rol del usuario', enum: ['admin', 'customer'] })
  @IsIn(['admin', 'customer'])
  role: 'admin' | 'customer';

  @ApiProperty({ example: 'active', description: 'Estado del usuario', enum: ['active', 'inactive'] })
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

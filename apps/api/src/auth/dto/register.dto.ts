import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre completo del usuario' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Correo electronico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contrasena del usuario' })
  @IsString()
  @MinLength(6)
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 'user-1', description: 'ID unico del usuario' })
  id: string;

  @ApiProperty({ example: 'Maria Lopez', description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ example: 'maria@example.com', description: 'Correo electronico' })
  email: string;

  @ApiProperty({ example: 'customer', description: 'Rol del usuario' })
  role: 'admin' | 'customer';

  @ApiProperty({ example: 'active', description: 'Estado del usuario' })
  status: 'active' | 'inactive';

  @ApiProperty({ example: 3, description: 'Cantidad ficticia de ordenes del usuario' })
  orderCount: number;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Fecha de creacion' })
  createdAt: string;
}

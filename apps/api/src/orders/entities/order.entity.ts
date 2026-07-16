import { ApiProperty } from '@nestjs/swagger';

export class OrderItem {
  @ApiProperty({ example: 'prod-1', description: 'ID del producto' })
  productId: string;

  @ApiProperty({ example: 'Laptop Gamer Pro', description: 'Nombre ficticio del producto' })
  productName: string;

  @ApiProperty({ example: 2, description: 'Cantidad' })
  quantity: number;

  @ApiProperty({ example: 1299.99, description: 'Precio unitario' })
  price: number;
}

export class Order {
  @ApiProperty({ example: 'ord-1', description: 'ID unico de la orden' })
  id: string;

  @ApiProperty({ example: 'user-2', description: 'ID del usuario' })
  userId: string;

  @ApiProperty({ example: 'Cliente Demo', description: 'Nombre ficticio del usuario' })
  userName: string;

  @ApiProperty({ type: [OrderItem], description: 'Items de la orden' })
  items: OrderItem[];

  @ApiProperty({ example: 2599.98, description: 'Total de la orden' })
  total: number;

  @ApiProperty({ example: 'pending', description: 'Estado de la orden' })
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

  @ApiProperty({ example: '2026-01-15T00:00:00.000Z', description: 'Fecha de creacion' })
  createdAt: string;
}

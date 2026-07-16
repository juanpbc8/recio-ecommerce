import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ example: 'prod-1', description: 'ID unico del producto' })
  id: string;

  @ApiProperty({ example: 'Laptop Gamer', description: 'Nombre del producto' })
  name: string;

  @ApiProperty({ example: 'Laptop de alto rendimiento', description: 'Descripcion del producto' })
  description: string;

  @ApiProperty({ example: 1299.99, description: 'Precio del producto' })
  price: number;

  @ApiProperty({ example: 25, description: 'Stock disponible' })
  stock: number;

  @ApiProperty({ example: 'cat-1', description: 'ID de la categoria' })
  categoryId: string;

  @ApiProperty({ example: 'https://example.com/laptop.jpg', description: 'Imagen del producto' })
  image: string;

  @ApiProperty({ example: 'active', description: 'Estado del producto' })
  status: 'active' | 'inactive';

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Fecha de creacion' })
  createdAt: string;
}

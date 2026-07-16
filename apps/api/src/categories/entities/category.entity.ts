import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ example: 'cat-1', description: 'ID unico de la categoria' })
  id: string;

  @ApiProperty({ example: 'Electronica', description: 'Nombre de la categoria' })
  name: string;

  @ApiProperty({ example: 'Productos electronicos', description: 'Descripcion de la categoria' })
  description: string;

  @ApiProperty({ example: 'https://placehold.co/200x200?text=Cat', description: 'Imagen de la categoria' })
  image: string;

  @ApiProperty({ example: 'active', description: 'Estado de la categoria' })
  status: 'active' | 'inactive';

  @ApiProperty({ example: 15, description: 'Cantidad ficticia de productos asociados' })
  productCount: number;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Fecha de creacion' })
  createdAt: string;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsIn, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Gamer', description: 'Nombre del producto' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Laptop de alto rendimiento para gaming', description: 'Descripcion del producto' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1299.99, description: 'Precio del producto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 25, description: 'Cantidad disponible' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'cat-1', description: 'ID de la categoria' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'https://example.com/laptop.jpg', description: 'URL de la imagen' })
  @IsString()
  image: string;

  @ApiProperty({ example: 'active', description: 'Estado del producto', enum: ['active', 'inactive'] })
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

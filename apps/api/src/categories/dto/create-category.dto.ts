import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronica', description: 'Nombre de la categoria' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Productos electronicos y tecnologia', description: 'Descripcion de la categoria' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'https://placehold.co/200x200?text=Electronica', description: 'Imagen de la categoria' })
  @IsString()
  image: string;

  @ApiProperty({ example: 'active', description: 'Estado de la categoria', enum: ['active', 'inactive'] })
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsIn, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: 'prod-1', description: 'ID del producto' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Cantidad del producto' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 1299.99, description: 'Precio unitario del producto' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'user-2', description: 'ID del usuario que realiza la orden' })
  @IsString()
  userId: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Items de la orden' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ArrayMinSize(1)
  items: OrderItemDto[];

  @ApiProperty({ example: 'pending', description: 'Estado de la orden', enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] })
  @IsIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

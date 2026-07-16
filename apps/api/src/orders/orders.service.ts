import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { Order, OrderItem } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private orders: Order[] = [
    {
      id: 'ord-1',
      userId: 'user-2',
      userName: 'Cliente Demo',
      items: [
        { productId: 'prod-1', productName: 'Laptop Gamer Pro', quantity: 1, price: 1299.99 },
      ],
      total: 1299.99,
      status: 'paid',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-2',
      userId: 'user-3',
      userName: 'Maria Lopez',
      items: [
        { productId: 'prod-2', productName: 'Mouse Inalambrico', quantity: 2, price: 49.99 },
        { productId: 'prod-5', productName: 'Auriculares Bluetooth', quantity: 1, price: 149.99 },
      ],
      total: 249.97,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-3',
      userId: 'user-2',
      userName: 'Cliente Demo',
      items: [
        { productId: 'prod-3', productName: 'Teclado Mecanico', quantity: 1, price: 89.99 },
      ],
      total: 89.99,
      status: 'delivered',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-4',
      userId: 'user-4',
      userName: 'Carlos Ruiz',
      items: [
        { productId: 'prod-4', productName: 'Monitor 27 pulgadas', quantity: 1, price: 499.99 },
      ],
      total: 499.99,
      status: 'shipped',
      createdAt: new Date().toISOString(),
    },
  ];

  private userNames: Record<string, string> = {
    'user-1': 'Administrador',
    'user-2': 'Cliente Demo',
    'user-3': 'Maria Lopez',
    'user-4': 'Carlos Ruiz',
  };

  private productNames: Record<string, string> = {
    'prod-1': 'Laptop Gamer Pro',
    'prod-2': 'Mouse Inalambrico',
    'prod-3': 'Teclado Mecanico',
    'prod-4': 'Monitor 27 pulgadas',
    'prod-5': 'Auriculares Bluetooth',
    'prod-6': 'Webcam HD',
  };

  private calculateTotal(items: OrderItem[]): number {
    return Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  }

  findAll(status?: string): Order[] {
    if (status) {
      return this.orders.filter((o) => o.status === status);
    }
    return [...this.orders];
  }

  findOne(id: string): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }
    return order;
  }

  create(createOrderDto: CreateOrderDto): Order {
    const items: OrderItem[] = createOrderDto.items.map((item) => ({
      ...item,
      productName: this.productNames[item.productId] ?? 'Producto desconocido',
    }));

    const newOrder: Order = {
      id: `ord-${this.orders.length + 1}`,
      userId: createOrderDto.userId,
      userName: this.userNames[createOrderDto.userId] ?? 'Usuario desconocido',
      items,
      total: this.calculateTotal(items),
      status: createOrderDto.status,
      createdAt: new Date().toISOString(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  update(id: string, updateOrderDto: UpdateOrderDto): Order {
    const order = this.findOne(id);
    const items = updateOrderDto.items?.map((item) => ({
      ...item,
      productName: this.productNames[item.productId] ?? 'Producto desconocido',
    }));

    const updatedOrder: Order = {
      ...order,
      ...updateOrderDto,
      items: items ?? order.items,
      total: items ? this.calculateTotal(items) : order.total,
      userName: updateOrderDto.userId ? this.userNames[updateOrderDto.userId] ?? order.userName : order.userName,
    };

    const index = this.orders.findIndex((o) => o.id === id);
    this.orders[index] = updatedOrder;
    return updatedOrder;
  }

  remove(id: string): { deleted: boolean } {
    this.findOne(id);
    this.orders = this.orders.filter((o) => o.id !== id);
    return { deleted: true };
  }
}

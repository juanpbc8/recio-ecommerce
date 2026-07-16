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
        { productId: 'prod-1', productName: 'Traje Clasico Azul Marino', quantity: 1, price: 459.99 },
      ],
      total: 459.99,
      status: 'paid',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-2',
      userId: 'user-3',
      userName: 'Maria Lopez',
      items: [
        { productId: 'prod-3', productName: 'Camisa Blanca de Vestir', quantity: 2, price: 59.99 },
        { productId: 'prod-8', productName: 'Zapatos Oxford Negros', quantity: 1, price: 149.99 },
      ],
      total: 269.97,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-3',
      userId: 'user-2',
      userName: 'Cliente Demo',
      items: [
        { productId: 'prod-4', productName: 'Camisa Azul de Vestir', quantity: 1, price: 54.99 },
        { productId: 'prod-7', productName: 'Corbata de Seda Roja', quantity: 1, price: 34.99 },
      ],
      total: 89.98,
      status: 'delivered',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-4',
      userId: 'user-4',
      userName: 'Carlos Ruiz',
      items: [
        { productId: 'prod-2', productName: 'Traje Gris Slim Fit', quantity: 1, price: 499.99 },
        { productId: 'prod-9', productName: 'Cinturon de Cuero Marron', quantity: 1, price: 44.99 },
      ],
      total: 544.98,
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
    'prod-1': 'Traje Clasico Azul Marino',
    'prod-2': 'Traje Gris Slim Fit',
    'prod-3': 'Camisa Blanca de Vestir',
    'prod-4': 'Camisa Azul de Vestir',
    'prod-5': 'Pantalon Chino Beige',
    'prod-6': 'Pantalon de Vestir Negro',
    'prod-7': 'Corbata de Seda Roja',
    'prod-8': 'Zapatos Oxford Negros',
    'prod-9': 'Cinturon de Cuero Marron',
    'prod-10': 'Blazer Elegante Azul',
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

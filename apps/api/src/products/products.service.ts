import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 'prod-1',
      name: 'Laptop Gamer Pro',
      description: 'Laptop de alto rendimiento con RTX 4060 y 32GB RAM',
      price: 1299.99,
      stock: 25,
      categoryId: 'cat-1',
      image: 'https://placehold.co/600x400?text=Laptop+Gamer',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-2',
      name: 'Mouse Inalambrico',
      description: 'Mouse ergonomico con 6 botones programables',
      price: 49.99,
      stock: 100,
      categoryId: 'cat-2',
      image: 'https://placehold.co/600x400?text=Mouse',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-3',
      name: 'Teclado Mecanico',
      description: 'Teclado mecanico RGB con switches azules',
      price: 89.99,
      stock: 60,
      categoryId: 'cat-2',
      image: 'https://placehold.co/600x400?text=Teclado',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-4',
      name: 'Monitor 27 pulgadas',
      description: 'Monitor 4K IPS de 27 pulgadas con 144Hz',
      price: 499.99,
      stock: 30,
      categoryId: 'cat-3',
      image: 'https://placehold.co/600x400?text=Monitor',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-5',
      name: 'Auriculares Bluetooth',
      description: 'Auriculares con cancelacion de ruido activa',
      price: 149.99,
      stock: 80,
      categoryId: 'cat-4',
      image: 'https://placehold.co/600x400?text=Auriculares',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-6',
      name: 'Webcam HD',
      description: 'Webcam 1080p con microfono integrado',
      price: 79.99,
      stock: 45,
      categoryId: 'cat-3',
      image: 'https://placehold.co/600x400?text=Webcam',
      status: 'inactive',
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(status?: string, categoryId?: string): Product[] {
    let result = [...this.products];

    if (status) {
      result = result.filter((p) => p.status === status);
    }

    if (categoryId) {
      result = result.filter((p) => p.categoryId === categoryId);
    }

    return result;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: `prod-${this.products.length + 1}`,
      ...createProductDto,
      createdAt: new Date().toISOString(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  update(id: string, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);
    const updatedProduct = { ...product, ...updateProductDto };
    const index = this.products.findIndex((p) => p.id === id);
    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  remove(id: string): { deleted: boolean } {
    this.findOne(id);
    this.products = this.products.filter((p) => p.id !== id);
    return { deleted: true };
  }
}

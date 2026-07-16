import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 'prod-1',
      name: 'Traje Clasico Azul Marino',
      description: 'Traje elegante de dos piezas en lana italiana, corte clasico para ocasiones formales',
      price: 459.99,
      stock: 12,
      categoryId: 'cat-1',
      image: 'https://placehold.co/600x400?text=Traje+Azul+Marino',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-2',
      name: 'Traje Gris Slim Fit',
      description: 'Traje moderno de corte entallado en color gris perla, ideal para eventos de negocios',
      price: 499.99,
      stock: 8,
      categoryId: 'cat-1',
      image: 'https://placehold.co/600x400?text=Traje+Gris+Slim',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-3',
      name: 'Camisa Blanca de Vestir',
      description: 'Camisa de algodon egipcio con cuello italiano, planchado facil y ajuste regular',
      price: 59.99,
      stock: 45,
      categoryId: 'cat-2',
      image: 'https://placehold.co/600x400?text=Camisa+Blanca',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-4',
      name: 'Camisa Azul de Vestir',
      description: 'Camisa azul celeste en popelin de alta calidad, perfecta para looks ejecutivos',
      price: 54.99,
      stock: 38,
      categoryId: 'cat-2',
      image: 'https://placehold.co/600x400?text=Camisa+Azul',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-5',
      name: 'Pantalon Chino Beige',
      description: 'Pantalon chino de corte recto en algodon premium, comodo y versatil',
      price: 79.99,
      stock: 30,
      categoryId: 'cat-3',
      image: 'https://placehold.co/600x400?text=Pantalon+Chino',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-6',
      name: 'Pantalon de Vestir Negro',
      description: 'Pantalon de vestir en lana, corte clasico y acabado impecable',
      price: 89.99,
      stock: 22,
      categoryId: 'cat-3',
      image: 'https://placehold.co/600x400?text=Pantalon+Vestir',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-7',
      name: 'Corbata de Seda Roja',
      description: 'Corbata artesanal en seda natural con textura jacquard, color rojo burdeos',
      price: 34.99,
      stock: 60,
      categoryId: 'cat-4',
      image: 'https://placehold.co/600x400?text=Corbata+Roja',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-8',
      name: 'Zapatos Oxford Negros',
      description: 'Zapatos Oxford de cuero genuino, suela de cuero y acabado pulido',
      price: 149.99,
      stock: 18,
      categoryId: 'cat-5',
      image: 'https://placehold.co/600x400?text=Oxford+Negros',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-9',
      name: 'Cinturon de Cuero Marron',
      description: 'Cinturon elegante de cuero vacuno con hebilla metalica satinada',
      price: 44.99,
      stock: 40,
      categoryId: 'cat-4',
      image: 'https://placehold.co/600x400?text=Cinturon+Marron',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-10',
      name: 'Blazer Elegante Azul',
      description: 'Blazer casual en azul marino, ideal para looks semi-formales y eventos diurnos',
      price: 199.99,
      stock: 15,
      categoryId: 'cat-1',
      image: 'https://placehold.co/600x400?text=Blazer+Azul',
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

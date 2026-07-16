import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Electronica',
      description: 'Computadoras, laptops y accesorios tecnologicos',
      image: 'https://placehold.co/200x200?text=Electronica',
      status: 'active',
      productCount: 12,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat-2',
      name: 'Perifericos',
      description: 'Mouse, teclados, auriculares y mas',
      image: 'https://placehold.co/200x200?text=Perifericos',
      status: 'active',
      productCount: 8,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat-3',
      name: 'Monitores',
      description: 'Monitores y pantallas de todas las pulgadas',
      image: 'https://placehold.co/200x200?text=Monitores',
      status: 'active',
      productCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat-4',
      name: 'Audio',
      description: 'Auriculares, parlantes y equipos de sonido',
      image: 'https://placehold.co/200x200?text=Audio',
      status: 'active',
      productCount: 6,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat-5',
      name: 'Ofertas',
      description: 'Productos en descuento y promociones',
      image: 'https://placehold.co/200x200?text=Ofertas',
      status: 'inactive',
      productCount: 3,
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(status?: string): Category[] {
    if (status) {
      return this.categories.filter((c) => c.status === status);
    }
    return [...this.categories];
  }

  findOne(id: string): Category {
    const category = this.categories.find((c) => c.id === id);
    if (!category) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada`);
    }
    return category;
  }

  create(createCategoryDto: CreateCategoryDto): Category {
    const newCategory: Category = {
      id: `cat-${this.categories.length + 1}`,
      ...createCategoryDto,
      productCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto): Category {
    const category = this.findOne(id);
    const updatedCategory = { ...category, ...updateCategoryDto };
    const index = this.categories.findIndex((c) => c.id === id);
    this.categories[index] = updatedCategory;
    return updatedCategory;
  }

  remove(id: string): { deleted: boolean } {
    this.findOne(id);
    this.categories = this.categories.filter((c) => c.id !== id);
    return { deleted: true };
  }
}

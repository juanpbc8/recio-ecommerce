import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Trajes',
      description: 'Trajes completos, blazers y sacos formales para caballero',
      image: 'https://placehold.co/200x200?text=Trajes',
      status: 'active',
      productCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat-2',
      name: 'Camisas',
      description: 'Camisas de vestir de algodon y popelin para todo tipo de ocasion',
      image: 'https://placehold.co/200x200?text=Camisas',
      status: 'active',
      productCount: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat-3',
      name: 'Pantalones',
      description: 'Pantalones de vestir, chinos y formales en diversos cortes',
      image: 'https://placehold.co/200x200?text=Pantalones',
      status: 'active',
      productCount: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat-4',
      name: 'Accesorios',
      description: 'Corbatas, cinturones, gemelos y detalles para complementar tu look',
      image: 'https://placehold.co/200x200?text=Accesorios',
      status: 'active',
      productCount: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cat-5',
      name: 'Zapatos',
      description: 'Zapatos formales Oxford, loafers y calzado elegante para hombre',
      image: 'https://placehold.co/200x200?text=Zapatos',
      status: 'active',
      productCount: 1,
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

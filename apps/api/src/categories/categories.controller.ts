import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorias' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive'] })
  @ApiResponse({ status: 200, description: 'Lista de categorias', type: [Category] })
  findAll(@Query('status') status?: string) {
    return this.categoriesService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoria por ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada', type: Category })
  @ApiResponse({ status: 404, description: 'Categoria no encontrada' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoria' })
  @ApiResponse({ status: 201, description: 'Categoria creada', type: Category })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoria' })
  @ApiResponse({ status: 200, description: 'Categoria actualizada', type: Category })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoria' })
  @ApiResponse({ status: 200, description: 'Categoria eliminada' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}

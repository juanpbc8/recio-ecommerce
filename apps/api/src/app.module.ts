import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [HealthModule, AuthModule, ProductsModule, CategoriesModule, UsersModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [HealthModule, AuthModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

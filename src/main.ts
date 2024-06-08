import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AggregateByTenantContextIdStrategy } from './aggregateByTenantContextIdStrategy';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    ContextIdFactory.apply(new AggregateByTenantContextIdStrategy())
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

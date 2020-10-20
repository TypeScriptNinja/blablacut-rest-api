import { NestFactory } from '@nestjs/core';
import * as rateLimit from 'express-rate-limit';
import { BlablaCutAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(BlablaCutAppModule, {
    logger: ['debug', 'error', 'warn'],
  });
  // app.use(
  //   rateLimit({
  //     windowMs: 10 * 60_1000,
  //     max: 20,
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();

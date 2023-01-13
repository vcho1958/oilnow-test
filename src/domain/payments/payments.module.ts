import { CacheModule, Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';
// 오답노트 import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
// 오답노트 CacheModule.register<ClientOpts>({
//       store: redisStore,
//       host: 'localhost',
//       port: 6379,
//     }),
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}

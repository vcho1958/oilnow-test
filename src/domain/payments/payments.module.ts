import { CacheModule, Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}

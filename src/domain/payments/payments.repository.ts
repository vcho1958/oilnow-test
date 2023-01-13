import { PrismaClient } from '@prisma/client';
import { PaymentCreateRequsetDto } from './dto/payment.create.dto';

export class PaymentsRepository extends PrismaClient {
  public async createPayment(data: PaymentCreateRequsetDto) {
    await this.payment.create({ data });
  }
}

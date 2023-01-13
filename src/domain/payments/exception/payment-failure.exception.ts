import { BadRequestException } from '@nestjs/common';

export class PaymentFailureException extends BadRequestException {
  constructor() {
    super({
      message: 'The request is failed',
    });
  }
}

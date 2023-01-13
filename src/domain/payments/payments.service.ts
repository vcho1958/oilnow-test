import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  PaymentCreateRequsetDto,
  PaymentCreateResponseDto,
} from './dto/payment.create.dto';
// import { PaymentsRepository } from './payments.repository';
import axios, { Axios } from 'axios';
import { Cache } from 'cache-manager';
import { environment } from 'src/common/environment';
import { PaymentFailureException } from './exception/payment-failure.exception';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly axios: Axios;
  constructor(
    @Inject('CACHE_MANAGER') private readonly cache: Cache,
    private paymentsRepository: PaymentsRepository,
  ) {
    this.axios = axios.create({ baseURL: environment.API_URL });
  }

  public async transferPayment(
    paymentCreateDto: PaymentCreateRequsetDto,
  ): Promise<PaymentCreateResponseDto> {
    const cacheKey = `${paymentCreateDto.id} ${paymentCreateDto.amount}`;
    //오답노트 if(await this.cache.get(cacheKey+'semaphore'))throw new DuplicateRequestException();
    //await this.cache.set(cacheKey+'semaphore', 1);
    await this.trasferPaymentToExternal(paymentCreateDto);
    this.paymentsRepository.createPayment(paymentCreateDto);
    
    const response: PaymentCreateResponseDto = {
      message: 'The request is successful',
    };
    await this.cache.set(cacheKey, response, 5000);
    //await this.cache.del(cacheKey+'semaphore');
    return response;
  }

  private async trasferPaymentToExternal(
    paymentCreateDto: PaymentCreateRequsetDto,
  ): Promise<void> {
    try {
      await this.axios
        .post<boolean>(`/payments`, paymentCreateDto)
        .then((response) => response.data);
    } catch (e) {
      throw new PaymentFailureException();
    }
  }
}

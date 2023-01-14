import { Body, Controller, Inject, Logger, Post, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';

import { Cache } from 'cache-manager';
import {
  PaymentCreateRequsetDto,
  PaymentCreateResponseDto,
} from './dto/payment.create.dto';
import { PaymentFailureException } from './exception/payment-failure.exception';
import { Response } from 'express';
import { DuplicateRequestException } from './exception/duplicate-request.exception';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject('CACHE_MANAGER') private readonly cache: Cache,
  ) {}
  @Post()
  public async transferPayment(
    @Body() paymentCreateDto: PaymentCreateRequsetDto,
  ): Promise<PaymentCreateResponseDto> {
    this.validatePaymentCreateDto(paymentCreateDto);
    const cacheKey = `${paymentCreateDto.id} ${paymentCreateDto.amount}`; 
    //이유 JSON.stringfy는 느리다고 알고있어서 이렇게 만들었습니다. 서비스단 함수이름도 키\에 포함했으면 좋았을 것 같네요
    if(await this.cache.get(cacheKey))throw new DuplicateRequestException();
    //오답노트 if(await this.cache.get(cacheKey+'semaphore'))throw new DuplicateRequestException();
    //await this.cache.set(cacheKey+'semaphore', 1, 5000); 
    //결과 캐싱 이외에 뮤택스 역할을 하는 것도 추가를 했어야했습니다.
    return await this.paymentsService.transferPayment(paymentCreateDto);
  }

  private validatePaymentCreateDto(paymentCreateDto: PaymentCreateRequsetDto) {
    //오답노트 네스트 기본 밸리데이션 파이프가 class-validator 기반으로 동작하는데 속도 저하가 생기기 때문에 인터페이스로만 받고 별도의 함수로 만들었습니다.
    //그렇다 하더라도 커스텀 파이프를 만들면 됐을텐데 아쉽네요.
    const { id, amount } = paymentCreateDto;
    if (isUndefined(id, amount)) throw new PaymentFailureException();
    if (!checkIdLength(id)) throw new PaymentFailureException();
    if (amountValueCheck(amount)) throw new PaymentFailureException();

    function isUndefined(id: string, amount: number) {
      return id === undefined || amount === undefined;
    }

    function checkIdLength(id: string) {
      //오답노트 typeof(id) === 'string'
      return id.length === 6;
    }

    function amountValueCheck(amount: number) {
      //오답노트 typeof(amount) !== 'number'
      return amount < 1;
    }
  }

  private logCached(cachedData: unknown | undefined) {
    this.logger.debug(
      `is${cachedData ? '' : "n't"} cached ${
        cachedData ? JSON.stringify(cachedData) : ''
      }`,
    );
  }
}

// id,       // 유저 ID, 6자리 문자열.
// amount    // 결제 금액, 숫자형.

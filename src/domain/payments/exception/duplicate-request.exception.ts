import { BadRequestException } from '@nestjs/common';

export class DuplicateRequestException extends BadRequestException {
  constructor() {
    super({ message: 'The request is duplicated' });
  }
}

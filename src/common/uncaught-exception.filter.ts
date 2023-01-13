import {Catch, ArgumentsHost, Logger} from '@nestjs/common';
import {BaseExceptionFilter, HttpAdapterHost} from '@nestjs/core';
import {Request} from "express";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
    catch(exception: Error, host: ArgumentsHost) {
        const req = host.switchToHttp().getRequest<Request>()
        this.logger.error(`${req.method} ${req.path} ${exception}`, exception.stack)
        super.catch(exception, host);
    }
}
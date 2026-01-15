import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

interface RequestWithId extends Request {
  id?: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const { method, url } = request;
    const requestId = uuidv4();

    // Add request ID to request object for use in filters and services
    request.id = requestId;

    const now = Date.now();
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip || request.socket?.remoteAddress || 'unknown';

    this.logger.log(`[${requestId}] ${method} ${url} - ${ip} - ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          this.logger.log(
            `[${requestId}] ${method} ${url} ${statusCode} - ${responseTime}ms`,
          );
        },
        error: (error: Error) => {
          const responseTime = Date.now() - now;
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          this.logger.error(
            `[${requestId}] ${method} ${url} ERROR - ${responseTime}ms - ${errorMessage}`,
          );
        },
      }),
    );
  }
}

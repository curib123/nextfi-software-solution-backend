import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../constants';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_KEY,
        context.getHandler(),
      ) ?? 'Operation successful';

    return next.handle().pipe(
      map((payload) => {
        if (
          payload &&
          typeof payload === 'object' &&
          'items' in (payload as Record<string, unknown>) &&
          'total' in (payload as Record<string, unknown>)
        ) {
          const listPayload = payload as {
            items: unknown[];
            total: number;
          };

          return {
            success: true,
            message,
            data: listPayload.items,
            meta: { total: listPayload.total },
          };
        }

        return {
          success: true,
          message,
          data: payload,
        };
      }),
    );
  }
}

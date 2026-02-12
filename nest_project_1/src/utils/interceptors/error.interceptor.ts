import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { handleError } from '../error/error-handler';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const defaultErrorCode = 'INTERNAL_SERVER_ERROR';
        const defaultMessage =
          'a unexpected error occured , please try again later';
        handleError(error, defaultErrorCode, defaultMessage);
      }),
    );
  }
}

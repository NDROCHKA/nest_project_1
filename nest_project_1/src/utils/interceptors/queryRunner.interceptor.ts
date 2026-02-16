import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Observable, from, lastValueFrom } from 'rxjs';
import { Request } from 'express';
import { safeRelease } from '../query-runner/query-runner.utils';

interface RequestWithQueryRunner extends Request {
  queryRunner?: QueryRunner;
}

@Injectable()
export class QueryRunnerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(QueryRunnerInterceptor.name);

  constructor(private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return from(this.handleContext(context, next));
  }

  private async handleContext(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithQueryRunner>();
    const requestLabel = this.describeRequest(request);

    if (!request) {
      return lastValueFrom(next.handle());
    }

    if (request.queryRunner) {
      this.logger.debug(
        `${requestLabel} - Reusing parent context QueryRunner instance`,
      );
      return lastValueFrom(next.handle());
    }

    const queryRunner = this.dataSource.createQueryRunner();
    request.queryRunner = queryRunner;
    this.logger.debug(`${requestLabel} - Created QueryRunner`);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug(`${requestLabel} - Transaction started`);

    try {
      const result = await lastValueFrom(next.handle());
      await queryRunner.commitTransaction();
      this.logger.debug(`${requestLabel} - Transaction committed`);
      return result;
    } catch (error) {
      this.logger.error(
        `${requestLabel} - Error running request`,
        error as Error,
      );
      await this.rollback(queryRunner, requestLabel);
      throw error;
    } finally {
      await safeRelease(queryRunner);
      request.queryRunner = undefined;
      this.logger.debug(`${requestLabel} - QueryRunner released`);
    }
  }

  private async rollback(
    queryRunner: QueryRunner,
    requestLabel: string,
  ): Promise<void> {
    if (!queryRunner.isTransactionActive) {
      return;
    }

    try {
      await queryRunner.rollbackTransaction();
      this.logger.debug(`${requestLabel} - Transaction rolled back`);
    } catch (error) {
      this.logger.error(`${requestLabel} - Rollback failed`, error as Error);
    }
  }

  private describeRequest(request?: Request): string {
    if (!request) {
      return '[unknown-request]';
    }

    const method = request.method ?? 'UNKNOWN';
    const url = request.originalUrl ?? request.url ?? '[unknown-url]';
    return `${method} ${url}`;
  }
}

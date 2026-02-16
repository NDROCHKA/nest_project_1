import { DataSource, QueryRunner } from 'typeorm';

export async function safeRelease(queryRunner: QueryRunner): Promise<void> {
  if (queryRunner.isReleased) {
    return;
  }

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      await queryRunner.release();
      break;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Attempt ${attempt} failed to release QueryRunner`, error);
      await delay(getBackoffDelay(attempt));
    }
  }
}

export async function runInTransaction<T>(
  dataSource: DataSource,
  operation: (queryRunner: QueryRunner) => Promise<T>,
): Promise<T> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const result = await operation(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await safeRelease(queryRunner);
  }
}

function getBackoffDelay(attempt: number): number {
  const baseDelay = 100;
  return baseDelay * Math.pow(2, attempt - 1);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

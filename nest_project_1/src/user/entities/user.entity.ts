import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  // @Index('IDX_USERS_EMAIL')
  @Column({ type: 'varchar', length: 320, unique: true   })
  email: string;

  @ApiProperty({ description: 'User age', example: 25 })
  @Column({ type: 'int' })
  age: number;

  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

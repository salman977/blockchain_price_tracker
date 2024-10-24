import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Price {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'The name of the chain',
  })
  @Column({ length: 500 })
  name: string;

  @ApiProperty({
    type: 'number',
    description: 'price of the chain',
  })
  @Column('decimal', { precision: 10, scale: 6 })
  price: number;

  @ApiProperty({
    type: 'string',
    description: 'The date and time when the alert was created',
    format: 'date-time',
  })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}

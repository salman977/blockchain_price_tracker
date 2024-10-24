import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Alert } from './alert.entity';
@Entity()
@Unique(['email'])
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'name of the user',
  })
  @Column({ length: 500 })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'email of the user',
  })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'The date and time when the alert was created',
    format: 'date-time',
  })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts: Alert[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity()
export class Alert {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: 'string', description: 'The chain for the alert' })
  @Column({ type: 'varchar', length: 255 })
  chain: string;

  @ApiProperty({
    type: 'number',
    description: 'The price threshold for the alert',
  })
  @Column({ type: 'decimal' })
  threshold: number;

  @ApiProperty({
    type: 'string',
    description: 'Email associated with the alert',
  })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ManyToOne(() => User, (user) => user.alerts)
  user: User;
}

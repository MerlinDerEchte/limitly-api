import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('decimal')
  expenseLimitByDay: number;

  @Column()
  currency: string;

  @Column()
  startDayOfWeek: string;
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RaceDriver } from './race-driver.model';
import { LapTime } from './lap-time.model';

@Entity()
export class RaceSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionName: string;

  @Column({ default: null })
  startTime: Date | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: 'Pending' })
  status: string;

  @Column({ default: 'Safe' })
  currentFlag: string;

  @OneToMany(() => RaceDriver, (driver) => driver.session, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  drivers: RaceDriver[];

  @OneToMany(() => LapTime, (lapTime) => lapTime.session) // Добавляем связь с LapTime
  lapTimes: LapTime[];
}

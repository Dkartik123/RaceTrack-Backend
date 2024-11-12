import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { RaceSession } from './race-session.model';
import { LapTime } from './lap-time.model';

@Entity()
export class RaceDriver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 }) // Указываем тип данных для имени гонщика
    name: string;

    @Column({ type: 'int' }) // Указываем тип данных для номера машины
    carNumber: number;

    @ManyToOne(() => RaceSession, (session) => session.drivers)
    session: RaceSession;

    @OneToMany(() => LapTime, (lapTime) => lapTime.driver)
    lapTimes: LapTime[];

    @Column({ type: 'float', nullable: true }) // Указываем тип данных для лучшего времени круга (опционально)
    fastestLap: number | null;
}

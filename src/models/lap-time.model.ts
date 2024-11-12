import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RaceDriver } from './race-driver.model';
import { RaceSession } from './race-session.model';

@Entity()
export class LapTime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' }) // Указываем тип данных для номера круга
    lapNumber: number;

    @Column({ type: 'float' }) // Указываем тип данных для времени круга
    time: number;

    @ManyToOne(() => RaceDriver, (driver) => driver.lapTimes)
    driver: RaceDriver;

    @ManyToOne(() => RaceSession, (session) => session.lapTimes)
    session: RaceSession;
}

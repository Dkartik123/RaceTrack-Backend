import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('timer')
export class Timer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true })
    raceId: number | null;

    @Column({ type: 'int', default: 0 })
    remainingSeconds: number;

    @Column({ type: 'boolean', default: false })
    isRunning: boolean;

    @Column({ type: 'datetime', nullable: true })
    lastUpdateTime: Date;

    @Column({ type: 'int', default: 600 }) // 10 минут по умолчанию
    duration: number;
} 
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RaceCar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    carNumber: string;

    @Column()
    model: string;
}

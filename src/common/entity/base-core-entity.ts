import { UUID } from "crypto";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseCoreEntity {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}
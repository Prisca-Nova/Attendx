import { UUID } from "crypto";
export declare abstract class BaseCoreEntity {
    id: UUID;
    createdAt: Date;
    updatedAt: Date;
}

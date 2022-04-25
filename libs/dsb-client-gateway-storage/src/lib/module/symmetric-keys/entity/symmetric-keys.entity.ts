import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('symmetric_keys')
export class SymmetricKeysEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientGatewayMessageId: string;

  @Column()
  payload: string;

  @Column()
  senderDid: string;
}

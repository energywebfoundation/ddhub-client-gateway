import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('symmetric_keys')
export class SymmetricKeysEntity {
  @PrimaryColumn()
  clientGatewayMessageId: string;

  @Column()
  payload: string;

  @PrimaryColumn()
  senderDid: string;
}

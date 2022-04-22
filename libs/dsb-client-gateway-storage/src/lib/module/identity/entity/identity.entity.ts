import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BalanceState } from '../identity.const';

@Entity('identity')
export class IdentityEntity {
  @PrimaryColumn()
  address: string;

  @Column()
  publicKey: string;

  @Column({
    enum: [BalanceState.NONE, BalanceState.OK, BalanceState.LOW],
    type: 'text',
  })
  public balance: BalanceState;
}

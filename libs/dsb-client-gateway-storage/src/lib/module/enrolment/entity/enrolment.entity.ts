import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';

export class Role {
  namespace: string;
  status: RoleStatus;
  required: boolean;
}

@Entity('enrolment')
export class EnrolmentEntity {
  @PrimaryColumn()
  did: string;

  @Column({
    type: 'text',
    transformer: {
      to(value: any): any {
        return JSON.stringify(value);
      },
      from(value: any): any {
        return JSON.parse(value);
      },
    },
  })
  roles: Role[];
}

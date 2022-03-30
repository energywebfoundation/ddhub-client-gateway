import { Enrolment, Identity } from '../storage/storage.interface';

export interface IdentityWithEnrolment extends Identity {
  enrolment: Enrolment;
}

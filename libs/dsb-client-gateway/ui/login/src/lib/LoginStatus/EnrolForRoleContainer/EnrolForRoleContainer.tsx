import RequestingEnrolment from '../RequestingEnrolment/RequestingEnrolment';
import EnrolForRole from '../EnrolForRole/EnrolForRole';
import { useEnrolForRoleEffects } from './EnrolForRoleContainer.effects';

export function EnrolForRoleContainer() {
  const {isEnrolRequested, enrolmentHandler} = useEnrolForRoleEffects();

  return (
    <>
      {isEnrolRequested ? (<RequestingEnrolment/>) : (
        <EnrolForRole onEnrolmentSubmit={enrolmentHandler}/>)}
    </>
  );
}

export default EnrolForRoleContainer;

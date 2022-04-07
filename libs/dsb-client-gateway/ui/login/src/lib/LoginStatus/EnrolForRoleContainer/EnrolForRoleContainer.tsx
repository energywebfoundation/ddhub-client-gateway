import RequestingEnrolment from '../RequestingEnrolment/RequestingEnrolment';
import EnrolForRole from '../EnrolForRole/EnrolForRole';
import { useEnrolForRole } from './EnrolForRoleContainer.effects';

export function EnrolForRoleContainer() {
  const {isEnrolRequested, enrolmentHandler} = useEnrolForRole();

  return (
    <>
      {isEnrolRequested ? (<RequestingEnrolment/>) : (
        <EnrolForRole onEnrolmentSubmit={enrolmentHandler}/>)}
    </>
  );
}

export default EnrolForRoleContainer;

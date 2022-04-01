import { useState } from 'react';
import RequestingEnrolment from '../RequestingEnrolment/RequestingEnrolment';
import EnrolForRole from '../EnrolForRole/EnrolForRole';
import { useEnrolmentControllerInit } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export function EnrolForRoleContainer() {
  const [isEnrolRequested, setIsEnrolRequested] = useState(false);
  const {mutate} = useEnrolmentControllerInit({mutation: {onError: error => console.log(error)}});
  const onEnrolmentSubmit = () => {
    mutate();
    setIsEnrolRequested(true);
  };

  return (
    <>
      {isEnrolRequested ? (<RequestingEnrolment/>) : (
        <EnrolForRole onEnrolmentSubmit={onEnrolmentSubmit}/>)}
    </>
  );
}

export default EnrolForRoleContainer;

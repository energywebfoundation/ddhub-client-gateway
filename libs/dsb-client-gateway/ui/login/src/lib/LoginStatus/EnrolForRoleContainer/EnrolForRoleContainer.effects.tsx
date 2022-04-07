import { useState } from 'react';
import { useEnrolmentControllerInit } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useEnrolForRole = () => {
  const [isEnrolRequested, setIsEnrolRequested] = useState(false);
  const { mutate } = useEnrolmentControllerInit();
  const enrolmentHandler = () => {
    mutate();
    setIsEnrolRequested(true);
  };

  return {isEnrolRequested, enrolmentHandler}
}

import LoadingInfo from '../LoadingInfo/LoadingInfo';
import { useLoginStatusEffects } from './RequestingEnrolment/LoginStatus.effects';
import {Backdrop, useBackdropContext} from "@dsb-client-gateway/ui/core";

export function LoginStatus() {
  const {isLoading, statusFactory} = useLoginStatusEffects();
  const { open, setLoader } = useBackdropContext();

  return (
    <>
      {isLoading ?  <Backdrop open={open} setLoader={setLoader}><LoadingInfo>Checking identity</LoadingInfo></Backdrop> : statusFactory()}
    </>
  );
}

export default LoginStatus;

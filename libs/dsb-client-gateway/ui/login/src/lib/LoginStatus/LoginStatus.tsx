import LoadingInfo from '../LoadingInfo/LoadingInfo';
import { useLoginStatusEffects } from './RequestingEnrolment/LoginStatus.effects';
import { Backdrop } from "@dsb-client-gateway/ui/core";
import { useBackdropContext } from "../../../../../../../apps/dsb-client-gateway-frontend/src/context"

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

import { render } from '@testing-library/react';

import DsbClientGatewayUiChannels from './dsb-client-gateway-ui-channels';

describe('DsbClientGatewayUiChannels', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DsbClientGatewayUiChannels />);
    expect(baseElement).toBeTruthy();
  });
});

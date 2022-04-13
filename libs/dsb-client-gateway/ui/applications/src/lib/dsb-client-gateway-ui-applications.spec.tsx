import { render } from '@testing-library/react';

import DsbClientGatewayUiApplications from './dsb-client-gateway-ui-applications';

describe('DsbClientGatewayUiApplications', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DsbClientGatewayUiApplications />);
    expect(baseElement).toBeTruthy();
  });
});

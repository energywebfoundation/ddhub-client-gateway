import { render } from '@testing-library/react';

import BrokerCard from './BrokerCard';

describe('BrokerCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrokerCard />);
    expect(baseElement).toBeTruthy();
  });
});

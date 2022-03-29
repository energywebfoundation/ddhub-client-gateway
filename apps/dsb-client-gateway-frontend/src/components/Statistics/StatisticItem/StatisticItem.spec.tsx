import { render } from '@testing-library/react';

import StatisticItem from './StatisticItem';

describe('StatisticItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StatisticItem />);
    expect(baseElement).toBeTruthy();
  });
});

import { render } from '@testing-library/react';

import AwaitingSyncing from './AwaitingSyncing';

describe('AwaitingSyncing', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AwaitingSyncing />);
    expect(baseElement).toBeTruthy();
  });
});

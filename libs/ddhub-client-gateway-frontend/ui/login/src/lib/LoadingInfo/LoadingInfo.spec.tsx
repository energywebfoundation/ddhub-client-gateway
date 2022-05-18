import { render } from '@testing-library/react';

import LoadingInfo from './LoadingInfo';

describe('LoadingInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoadingInfo />);
    expect(baseElement).toBeTruthy();
  });
});

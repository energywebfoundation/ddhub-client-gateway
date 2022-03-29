import { render } from '@testing-library/react';

import Status from './Status';

describe('Status', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Status />);
    expect(baseElement).toBeTruthy();
  });
});

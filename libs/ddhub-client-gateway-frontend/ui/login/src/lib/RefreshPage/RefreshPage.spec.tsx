import { render } from '@testing-library/react';

import RefreshPage from './RefreshPage';

describe('RefreshPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RefreshPage />);
    expect(baseElement).toBeTruthy();
  });
});

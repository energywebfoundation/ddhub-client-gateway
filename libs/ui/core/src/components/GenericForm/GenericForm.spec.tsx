import { render } from '@testing-library/react';

import GenericForm from './GenericForm';

describe('GenericForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GenericForm />);
    expect(baseElement).toBeTruthy();
  });
});

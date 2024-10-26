import { render } from '@testing-library/react';

import NxReactCalendarHeatmap from './nx-react-calendar-heatmap';

describe('NxReactCalendarHeatmap', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NxReactCalendarHeatmap />);
    expect(baseElement).toBeTruthy();
  });
});

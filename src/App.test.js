import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  expect(screen.getByText(/MyCityWeather App/i)).toBeInTheDocument();
});



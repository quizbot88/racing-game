import { render, screen } from '@testing-library/react';
import App from './App';

test('renders score label', () => {
  render(<App />);
  const scoreElement = screen.getByText(/Score:/i);
  expect(scoreElement).toBeInTheDocument();
});

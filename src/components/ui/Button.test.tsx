// import { render, screen, fireEvent } from '@testing-library/react';
// import { Button } from './Button';

// describe('Button', () => {
//   it('renders the button with the correct text', () => {
//     render(<Button>Click me</Button>);
//     const buttonElement = screen.getByText(/Click me/i);
//     expect(buttonElement).toBeInTheDocument();
//   });

//   it('calls the onClick handler when clicked', () => {
//     const handleClick = jest.fn();
//     render(<Button onClick={handleClick}>Click me</Button>);
//     const buttonElement = screen.getByText(/Click me/i);
//     fireEvent.click(buttonElement);
//     expect(handleClick).toHaveBeenCalledTimes(1);
//   });

//   it('applies the correct variant class', () => {
//     render(<Button variant="primary">Click me</Button>);
//     const buttonElement = screen.getByText(/Click me/i);
//     // This is an example class name, you may need to adjust it
//     // based on your actual CSS or Tailwind CSS configuration.
//     expect(buttonElement).toHaveClass('bg-blue-600');
//   });
// });
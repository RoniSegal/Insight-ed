import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Button } from '@/components/ui/Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-600');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-2', 'border-primary-600');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary-600', 'bg-transparent');
    });

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-error-600');
    });

    it('should render success variant', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-success-600');
    });

    it('should render warning variant', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-warning-600');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-5', 'py-2.5', 'text-base');
    });

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-2', 'text-sm');
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('Full Width', () => {
    it('should not be full width by default', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });

    it('should render full width when specified', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should disable button when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should hide left icon when loading', () => {
      render(
        <Button loading leftIcon={<span data-testid="left-icon">Icon</span>}>
          Loading
        </Button>
      );
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    });

    it('should hide right icon when loading', () => {
      render(
        <Button loading rightIcon={<span data-testid="right-icon">Icon</span>}>
          Loading
        </Button>
      );
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have disabled styles', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-60', 'disabled:cursor-not-allowed');
    });
  });

  describe('Icons', () => {
    it('should render left icon', () => {
      render(<Button leftIcon={<span data-testid="left-icon">←</span>}>With Left Icon</Button>);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      render(<Button rightIcon={<span data-testid="right-icon">→</span>}>With Right Icon</Button>);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should render both icons', () => {
      render(
        <Button
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        >
          Both Icons
        </Button>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should apply spacing classes to left icon', () => {
      render(<Button leftIcon={<span data-testid="left-icon">←</span>}>Button</Button>);
      const iconContainer = screen.getByTestId('left-icon').parentElement;
      expect(iconContainer).toHaveClass('me-2');
    });

    it('should apply spacing classes to right icon', () => {
      render(<Button rightIcon={<span data-testid="right-icon">→</span>}>Button</Button>);
      const iconContainer = screen.getByTestId('right-icon').parentElement;
      expect(iconContainer).toHaveClass('ms-2');
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should pass through data attributes', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('should pass through aria attributes', () => {
      render(<Button aria-label="Custom Label">Button</Button>);
      expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should be focusable', async () => {
      const user = userEvent.setup();
      render(<Button>Focusable</Button>);

      await user.tab();

      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have focus-visible styles', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('Combinations', () => {
    it('should render all props together correctly', () => {
      const handleClick = jest.fn();

      render(
        <Button
          variant="success"
          size="lg"
          fullWidth
          leftIcon={<span data-testid="icon">✓</span>}
          onClick={handleClick}
          className="custom-class"
        >
          Save Changes
        </Button>
      );

      const button = screen.getByRole('button');

      expect(button).toHaveClass(
        'bg-success-600',
        'px-6',
        'py-3',
        'text-lg',
        'w-full',
        'custom-class'
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(button).toHaveTextContent('Save Changes');
    });
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Input } from '@/components/ui/Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('should render input field', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Label', () => {
    it('should render label when provided', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should associate label with input', () => {
      render(<Input label="Email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('id');
    });

    it('should use custom id when provided', () => {
      render(<Input label="Email" id="email-input" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('should generate unique id when not provided', () => {
      const { rerender } = render(<Input label="Email 1" />);
      const input1 = screen.getByLabelText('Email 1');
      const id1 = input1.getAttribute('id');

      rerender(<Input label="Email 2" />);
      const input2 = screen.getByLabelText('Email 2');
      const id2 = input2.getAttribute('id');

      expect(id1).not.toBe(id2);
    });
  });

  describe('Variants', () => {
    it('should render default variant by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-neutral-300');
    });

    it('should render error variant', () => {
      render(<Input variant="error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-500');
    });

    it('should render success variant', () => {
      render(<Input variant="success" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-success-500');
    });

    it('should override variant with error prop', () => {
      render(<Input variant="success" error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-500');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-2', 'text-base');
    });

    it('should render small size', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should render large size', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-3', 'text-lg');
    });
  });

  describe('Error Handling', () => {
    it('should display error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('should apply error variant when error is present', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-500');
    });

    it('should not display helper text when error is present', () => {
      render(<Input error="Error message" helperText="Helper text" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('should display helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('should not have alert role for helper text', () => {
      render(<Input helperText="Helper text" />);
      const helperText = screen.getByText('Helper text');
      expect(helperText).not.toHaveAttribute('role', 'alert');
    });
  });

  describe('Icons', () => {
    it('should render left icon', () => {
      render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should apply padding when left icon is present', () => {
      render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('ps-10');
    });

    it('should apply padding when right icon is present', () => {
      render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pe-10');
    });

    it('should render both icons', () => {
      render(
        <Input
          leftIcon={<span data-testid="left-icon">🔍</span>}
          rightIcon={<span data-testid="right-icon">✓</span>}
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should have disabled styles', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:bg-neutral-100');
    });
  });

  describe('Input Types', () => {
    it('should render email type', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should render password type', () => {
      render(<Input type="password" />);
      const input = screen.getByPlaceholderText('') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('should render number type', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Value Management', () => {
    it('should accept value prop', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('test value');
    });

    it('should accept defaultValue prop', () => {
      render(<Input defaultValue="default value" />);
      expect(screen.getByRole('textbox')).toHaveValue('default value');
    });

    it('should call onChange when value changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'test');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should be focusable', async () => {
      const user = userEvent.setup();
      render(<Input />);

      await user.tab();

      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should have focus styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through name attribute', () => {
      render(<Input name="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
    });

    it('should pass through required attribute', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should pass through maxLength attribute', () => {
      render(<Input maxLength={10} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
    });

    it('should pass through autoComplete attribute', () => {
      render(<Input autoComplete="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('autoComplete', 'email');
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Combinations', () => {
    it('should render all props together correctly', () => {
      render(
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          helperText="We'll never share your email"
          leftIcon={<span data-testid="icon">📧</span>}
          size="lg"
          className="custom-class"
        />
      );

      const input = screen.getByLabelText('Email Address');

      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'you@example.com');
      expect(input).toHaveClass('px-4', 'py-3', 'text-lg', 'ps-10', 'custom-class');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    });

    it('should prioritize error over helper text', () => {
      render(
        <Input
          label="Password"
          error="Password is required"
          helperText="At least 8 characters"
        />
      );

      expect(screen.getByRole('alert')).toHaveTextContent('Password is required');
      expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument();
    });
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Alert } from '@/components/ui/Alert';

describe('Alert', () => {
  describe('Rendering', () => {
    it('should render alert with children', () => {
      render(<Alert>Alert message</Alert>);
      expect(screen.getByRole('alert')).toHaveTextContent('Alert message');
    });

    it('should render with custom className', () => {
      render(<Alert className="custom-class">Alert</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Alert ref={ref}>Alert</Alert>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('should render info variant by default', () => {
      render(<Alert>Info message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-primary-50', 'border-primary-500');
    });

    it('should render success variant', () => {
      render(<Alert variant="success">Success message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-success-50', 'border-success-500');
    });

    it('should render warning variant', () => {
      render(<Alert variant="warning">Warning message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-warning-50', 'border-warning-500');
    });

    it('should render error variant', () => {
      render(<Alert variant="error">Error message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-error-50', 'border-error-500');
    });
  });

  describe('Title', () => {
    it('should render title when provided', () => {
      render(<Alert title="Alert Title">Alert message</Alert>);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
    });

    it('should render without title', () => {
      render(<Alert>Alert message</Alert>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should apply correct styles to title', () => {
      render(<Alert title="Title">Message</Alert>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('font-semibold', 'mb-1', 'text-base');
    });
  });

  describe('Icons', () => {
    it('should render default info icon for info variant', () => {
      render(<Alert variant="info">Info message</Alert>);
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render default success icon for success variant', () => {
      render(<Alert variant="success">Success message</Alert>);
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render default warning icon for warning variant', () => {
      render(<Alert variant="warning">Warning message</Alert>);
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render default error icon for error variant', () => {
      render(<Alert variant="error">Error message</Alert>);
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render custom icon when provided', () => {
      render(<Alert icon={<span data-testid="custom-icon">🎉</span>}>Custom icon message</Alert>);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should use custom icon instead of default', () => {
      const { container } = render(
        <Alert variant="info" icon={<span data-testid="custom-icon">🎉</span>}>
          Message
        </Alert>
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      // Should only have one icon (the custom one)
      const icons = container.querySelectorAll('[data-testid="custom-icon"]');
      expect(icons).toHaveLength(1);
    });
  });

  describe('Dismissible', () => {
    it('should not show dismiss button by default', () => {
      render(<Alert>Alert message</Alert>);
      expect(screen.queryByLabelText('סגור התראה')).not.toBeInTheDocument();
    });

    it('should show dismiss button when dismissible is true', () => {
      const handleDismiss = jest.fn();
      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Dismissible alert
        </Alert>
      );
      expect(screen.getByLabelText('סגור התראה')).toBeInTheDocument();
    });

    it('should call onDismiss when dismiss button is clicked', async () => {
      const handleDismiss = jest.fn();
      const user = userEvent.setup();

      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Dismissible alert
        </Alert>
      );

      await user.click(screen.getByLabelText('סגור התראה'));

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('should not show dismiss button if dismissible is true but onDismiss is not provided', () => {
      render(<Alert dismissible>Alert message</Alert>);
      expect(screen.queryByLabelText('סגור התראה')).not.toBeInTheDocument();
    });

    it('should render dismiss button with correct icon', () => {
      const handleDismiss = jest.fn();
      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Alert
        </Alert>
      );
      const button = screen.getByLabelText('סגור התראה');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have correct layout structure', () => {
      const { container } = render(
        <Alert title="Title" dismissible onDismiss={() => {}}>
          Message
        </Alert>
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert?.querySelector('.flex.items-start.gap-3')).toBeInTheDocument();
    });

    it('should have icon in flex-shrink-0 container', () => {
      const { container } = render(<Alert>Message</Alert>);
      const iconContainer = container.querySelector('.flex-shrink-0');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer?.querySelector('svg')).toBeInTheDocument();
    });

    it('should have content in flex-1 container', () => {
      const { container } = render(<Alert>Message</Alert>);
      const contentContainer = container.querySelector('.flex-1.min-w-0');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through data attributes', () => {
      render(<Alert data-testid="custom-alert">Alert</Alert>);
      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });

    it('should have role="alert"', () => {
      render(<Alert>Alert message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Alert.displayName).toBe('Alert');
    });
  });

  describe('Styling', () => {
    it('should have correct base styles', () => {
      render(<Alert>Alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('rounded-lg', 'p-4', 'border-s-4', 'shadow-sm');
    });

    it('should apply text color for info variant', () => {
      render(<Alert variant="info">Info</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('text-primary-900');
    });

    it('should apply text color for success variant', () => {
      render(<Alert variant="success">Success</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('text-success-900');
    });

    it('should apply text color for warning variant', () => {
      render(<Alert variant="warning">Warning</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('text-warning-900');
    });

    it('should apply text color for error variant', () => {
      render(<Alert variant="error">Error</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('text-error-900');
    });
  });

  describe('Dismiss Button Styling', () => {
    it('should have correct dismiss button styles', () => {
      const handleDismiss = jest.fn();
      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Alert
        </Alert>
      );
      const button = screen.getByLabelText('סגור התראה');
      expect(button).toHaveClass(
        'flex-shrink-0',
        'inline-flex',
        'rounded-md',
        'p-1.5',
        'hover:bg-black/10',
        'transition-colors'
      );
    });

    it('should be keyboard accessible', async () => {
      const handleDismiss = jest.fn();
      const user = userEvent.setup();

      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Alert
        </Alert>
      );

      const button = screen.getByLabelText('סגור התראה');
      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe('Combinations', () => {
    it('should render all props together correctly', async () => {
      const handleDismiss = jest.fn();
      const user = userEvent.setup();

      render(
        <Alert
          variant="success"
          title="Success!"
          dismissible
          onDismiss={handleDismiss}
          icon={<span data-testid="custom-icon">✓</span>}
          className="custom-class"
        >
          Your changes have been saved successfully.
        </Alert>
      );

      const alert = screen.getByRole('alert');

      expect(alert).toHaveClass('bg-success-50', 'border-success-500', 'custom-class');
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Your changes have been saved successfully.')).toBeInTheDocument();
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();

      const dismissButton = screen.getByLabelText('סגור התראה');
      expect(dismissButton).toBeInTheDocument();

      await user.click(dismissButton);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content', () => {
    it('should render children text', () => {
      render(<Alert>Simple text message</Alert>);
      expect(screen.getByText('Simple text message')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <Alert>
          <div>
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </div>
        </Alert>
      );
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });

    it('should render title and children together', () => {
      render(<Alert title="Important">Please read this carefully.</Alert>);
      expect(screen.getByText('Important')).toBeInTheDocument();
      expect(screen.getByText('Please read this carefully.')).toBeInTheDocument();
    });
  });
});

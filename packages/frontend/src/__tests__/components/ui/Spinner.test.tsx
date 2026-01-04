import { render, screen } from '@testing-library/react';
import React from 'react';

import { Spinner, LoadingPage, LoadingContent } from '@/components/ui/Spinner';

describe('Spinner', () => {
  describe('Rendering', () => {
    it('should render spinner', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Spinner className="custom-class" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<SVGSVGElement>();
      render(<Spinner ref={ref} />);
      expect(ref.current).toBeInstanceOf(SVGSVGElement);
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-6', 'w-6');
    });

    it('should render small size', () => {
      render(<Spinner size="sm" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-4', 'w-4');
    });

    it('should render large size', () => {
      render(<Spinner size="lg" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-8', 'w-8');
    });

    it('should render extra large size', () => {
      render(<Spinner size="xl" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });
  });

  describe('Colors', () => {
    it('should render primary color by default', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-primary-600');
    });

    it('should render white color', () => {
      render(<Spinner color="white" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-white');
    });

    it('should render current color', () => {
      render(<Spinner color="current" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-current');
    });
  });

  describe('Accessibility', () => {
    it('should have default label', () => {
      render(<Spinner />);
      expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    });

    it('should accept custom label', () => {
      render(<Spinner label="טוען נתונים..." />);
      expect(screen.getByLabelText('טוען נתונים...')).toBeInTheDocument();
    });

    it('should have sr-only text for screen readers', () => {
      render(<Spinner label="Custom loading" />);
      const srText = screen.getByText('Custom loading');
      expect(srText).toHaveClass('sr-only');
    });

    it('should have role="status"', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-label', () => {
      render(<Spinner label="Loading data" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading data');
    });
  });

  describe('Animation', () => {
    it('should have spin animation', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('SVG Structure', () => {
    it('should render SVG element', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have correct viewBox', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should have circle element', () => {
      const { container } = render(<Spinner />);
      const circle = container.querySelector('circle');
      expect(circle).toBeInTheDocument();
    });

    it('should have path element', () => {
      const { container } = render(<Spinner />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Spinner.displayName).toBe('Spinner');
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through data attributes', () => {
      render(<Spinner data-testid="custom-spinner" />);
      expect(screen.getByTestId('custom-spinner')).toBeInTheDocument();
    });
  });

  describe('Combinations', () => {
    it('should render all props together correctly', () => {
      render(<Spinner size="lg" color="white" label="Loading content" className="custom-class" />);

      const spinner = screen.getByRole('status');

      expect(spinner).toHaveClass('h-8', 'w-8', 'text-white', 'custom-class', 'animate-spin');
      expect(spinner).toHaveAttribute('aria-label', 'Loading content');
      expect(screen.getByText('Loading content')).toHaveClass('sr-only');
    });
  });
});

describe('LoadingPage', () => {
  describe('Rendering', () => {
    it('should render loading page', () => {
      render(<LoadingPage />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render with default message', () => {
      render(<LoadingPage />);
      expect(screen.getByText('טוען...')).toBeInTheDocument();
    });

    it('should render with custom message', () => {
      render(<LoadingPage message="טוען נתונים..." />);
      expect(screen.getByText('טוען נתונים...')).toBeInTheDocument();
    });

    it('should not render message when not provided', () => {
      render(<LoadingPage message="" />);
      expect(screen.queryByText(/טוען/)).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have full screen height', () => {
      const { container } = render(<LoadingPage />);
      const wrapper = container.querySelector('.min-h-screen');
      expect(wrapper).toBeInTheDocument();
    });

    it('should center content', () => {
      const { container } = render(<LoadingPage />);
      const wrapper = container.querySelector('.flex.items-center.justify-center');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have background color', () => {
      const { container } = render(<LoadingPage />);
      const wrapper = container.querySelector('.bg-neutral-50');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have fade-in animation', () => {
      const { container } = render(<LoadingPage />);
      const content = container.querySelector('.animate-fadeIn');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Spinner Size', () => {
    it('should render XL spinner', () => {
      render(<LoadingPage />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });
  });

  describe('Message Styling', () => {
    it('should style message correctly', () => {
      render(<LoadingPage message="Loading" />);
      const message = screen.getByText('Loading');
      expect(message).toHaveClass('mt-6', 'text-lg', 'text-neutral-700', 'font-medium');
    });
  });
});

describe('LoadingContent', () => {
  describe('Rendering', () => {
    it('should render loading content', () => {
      render(<LoadingContent />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render with default message', () => {
      render(<LoadingContent />);
      expect(screen.getByText('טוען...')).toBeInTheDocument();
    });

    it('should render with custom message', () => {
      render(<LoadingContent message="טוען תוכן..." />);
      expect(screen.getByText('טוען תוכן...')).toBeInTheDocument();
    });

    it('should not render message when not provided', () => {
      render(<LoadingContent message="" />);
      expect(screen.queryByText(/טוען/)).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should center content horizontally and vertically', () => {
      const { container } = render(<LoadingContent />);
      const wrapper = container.querySelector('.flex.items-center.justify-center');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have vertical padding', () => {
      const { container } = render(<LoadingContent />);
      const wrapper = container.querySelector('.py-12');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have fade-in animation', () => {
      const { container } = render(<LoadingContent />);
      const content = container.querySelector('.animate-fadeIn');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Spinner Size', () => {
    it('should render large spinner', () => {
      render(<LoadingContent />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-8', 'w-8');
    });
  });

  describe('Message Styling', () => {
    it('should style message correctly', () => {
      render(<LoadingContent message="Loading" />);
      const message = screen.getByText('Loading');
      expect(message).toHaveClass('mt-4', 'text-base', 'text-neutral-700', 'font-medium');
    });
  });
});

describe('Loading Components Comparison', () => {
  it('should have different spinner sizes between Page and Content', () => {
    const { rerender } = render(<LoadingPage />);
    const pageSpinner = screen.getByRole('status');
    expect(pageSpinner).toHaveClass('h-12', 'w-12');

    rerender(<LoadingContent />);
    const contentSpinner = screen.getByRole('status');
    expect(contentSpinner).toHaveClass('h-8', 'w-8');
  });

  it('should have different message sizes between Page and Content', () => {
    const { rerender } = render(<LoadingPage message="Test" />);
    const pageMessage = screen.getByText('Test');
    expect(pageMessage).toHaveClass('text-lg');

    rerender(<LoadingContent message="Test" />);
    const contentMessage = screen.getByText('Test');
    expect(contentMessage).toHaveClass('text-base');
  });
});

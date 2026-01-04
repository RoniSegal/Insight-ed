import { render, screen } from '@testing-library/react';
import React from 'react';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

describe('Card', () => {
  describe('Rendering', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Card className="custom-class">Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Card</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('should render default variant by default', () => {
      render(<Card>Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('shadow');
    });

    it('should render bordered variant', () => {
      render(<Card variant="bordered">Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('border', 'border-neutral-200');
    });

    it('should render elevated variant', () => {
      render(<Card variant="elevated">Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('shadow-md');
    });

    it('should render insight variant', () => {
      render(<Card variant="insight">Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('card-insight');
    });
  });

  describe('Padding', () => {
    it('should render default padding by default', () => {
      render(<Card>Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('p-6');
    });

    it('should render no padding', () => {
      render(<Card padding="none">Content</Card>);
      const card = screen.getByText('Content');
      expect(card).not.toHaveClass('p-6');
    });

    it('should render compact padding', () => {
      render(<Card padding="compact">Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('p-4');
    });

    it('should render spacious padding', () => {
      render(<Card padding="spacious">Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('p-8');
    });
  });

  describe('As Prop', () => {
    it('should render as div by default', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should render as section', () => {
      const { container } = render(<Card as="section">Content</Card>);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should render as article', () => {
      const { container } = render(<Card as="article">Content</Card>);
      expect(container.querySelector('article')).toBeInTheDocument();
    });
  });

  describe('Base Styles', () => {
    it('should have base card styles', () => {
      render(<Card>Content</Card>);
      const card = screen.getByText('Content');
      expect(card).toHaveClass('bg-white', 'rounded-lg');
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through data attributes', () => {
      render(<Card data-testid="custom-card">Content</Card>);
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });

    it('should pass through aria attributes', () => {
      render(<Card aria-label="Custom Card">Content</Card>);
      expect(screen.getByLabelText('Custom Card')).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Card.displayName).toBe('Card');
    });
  });

  describe('Combinations', () => {
    it('should render all props together correctly', () => {
      render(
        <Card
          variant="elevated"
          padding="spacious"
          as="section"
          className="custom-class"
          data-testid="combo-card"
        >
          Combined props
        </Card>
      );

      const card = screen.getByTestId('combo-card');

      expect(card).toHaveClass('shadow-md', 'p-8', 'custom-class');
      expect(card.tagName).toBe('SECTION');
    });
  });
});

describe('CardHeader', () => {
  describe('Rendering', () => {
    it('should render card header', () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<CardHeader className="custom-class">Header</CardHeader>);
      const header = screen.getByText('Header').parentElement;
      expect(header).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardHeader ref={ref}>Header</CardHeader>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Title', () => {
    it('should render title when provided', () => {
      render(<CardHeader title="Card Title" />);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('should apply correct styles to title', () => {
      render(<CardHeader title="Title" />);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('text-xl', 'font-semibold', 'text-neutral-800');
    });
  });

  describe('Description', () => {
    it('should render description when provided', () => {
      render(<CardHeader description="Card description" />);
      expect(screen.getByText('Card description')).toBeInTheDocument();
    });

    it('should apply correct styles to description', () => {
      render(<CardHeader description="Description" />);
      const description = screen.getByText('Description');
      expect(description).toHaveClass('text-sm', 'text-neutral-500', 'mt-1');
    });

    it('should render title and description together', () => {
      render(<CardHeader title="Title" description="Description" />);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Action', () => {
    it('should render action when provided', () => {
      render(<CardHeader action={<button>Action</button>} />);
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('should position action correctly', () => {
      const { container } = render(<CardHeader action={<button>Action</button>} />);
      const actionContainer = container.querySelector('.ms-4');
      expect(actionContainer).toBeInTheDocument();
    });
  });

  describe('Children', () => {
    it('should render children', () => {
      render(
        <CardHeader>
          <div>Custom content</div>
        </CardHeader>
      );
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('should render title, description, and children together', () => {
      render(
        <CardHeader title="Title" description="Description">
          <div>Additional content</div>
        </CardHeader>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Additional content')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have correct layout structure', () => {
      const { container } = render(<CardHeader title="Title" action={<button>Action</button>} />);
      const header = container.querySelector('.flex.items-start.justify-between');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(CardHeader.displayName).toBe('CardHeader');
    });
  });

  describe('Combinations', () => {
    it('should render all props together correctly', () => {
      render(
        <CardHeader
          title="Card Title"
          description="Card Description"
          action={<button>Edit</button>}
          className="custom-header"
        >
          <p>Extra content</p>
        </CardHeader>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
      expect(screen.getByText('Extra content')).toBeInTheDocument();
    });
  });
});

describe('CardContent', () => {
  describe('Rendering', () => {
    it('should render card content', () => {
      render(<CardContent>Content text</CardContent>);
      expect(screen.getByText('Content text')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<CardContent className="custom-class">Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref}>Content</CardContent>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(CardContent.displayName).toBe('CardContent');
    });
  });
});

describe('CardFooter', () => {
  describe('Rendering', () => {
    it('should render card footer', () => {
      render(<CardFooter>Footer text</CardFooter>);
      expect(screen.getByText('Footer text')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<CardFooter className="custom-class">Footer</CardFooter>);
      const footer = screen.getByText('Footer');
      expect(footer).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardFooter ref={ref}>Footer</CardFooter>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Styling', () => {
    it('should have correct footer styles', () => {
      render(<CardFooter>Footer</CardFooter>);
      const footer = screen.getByText('Footer');
      expect(footer).toHaveClass('mt-4', 'pt-4', 'border-t', 'border-neutral-200');
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(CardFooter.displayName).toBe('CardFooter');
    });
  });
});

describe('Card Composition', () => {
  it('should compose all card sub-components together', () => {
    render(
      <Card variant="elevated" padding="default">
        <CardHeader
          title="Student Profile"
          description="View and edit student information"
          action={<button>Edit</button>}
        />
        <CardContent>
          <p>Student details go here</p>
        </CardContent>
        <CardFooter>
          <button>Save</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Student Profile')).toBeInTheDocument();
    expect(screen.getByText('View and edit student information')).toBeInTheDocument();
    expect(screen.getByText('Student details go here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should work with partial composition', () => {
    render(
      <Card>
        <CardHeader title="Simple Card" />
        <CardContent>Just content, no footer</CardContent>
      </Card>
    );

    expect(screen.getByText('Simple Card')).toBeInTheDocument();
    expect(screen.getByText('Just content, no footer')).toBeInTheDocument();
  });
});

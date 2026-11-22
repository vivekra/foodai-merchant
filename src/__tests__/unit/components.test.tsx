import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, Input, Badge, Skeleton, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

describe('UI Component Unit Tests', () => {
  describe('Button Component', () => {
    it('creates button element with proper text', () => {
      render(<Button>Click me</Button>);
      const btn = screen.getByRole('button', { name: /click me/i });
      expect(btn).toBeDefined();
      expect(btn.textContent).toBe('Click me');
    });

    it('applies variant classes correctly', () => {
      const { rerender } = render(<Button variant="default">Default</Button>);
      let btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-primary');

      rerender(<Button variant="outline">Outline</Button>);
      btn = screen.getByRole('button');
      expect(btn.className).toContain('border');

      rerender(<Button variant="destructive">Delete</Button>);
      btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-destructive');
    });

    it('supports size modifiers', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      let btn = screen.getByRole('button');
      expect(btn.className).toContain('h-9');

      rerender(<Button size="lg">Large</Button>);
      btn = screen.getByRole('button');
      expect(btn.className).toContain('h-11');
    });
  });

  describe('Badge Component', () => {
    it('renders with default variant styling', () => {
      render(<Badge>Active Status</Badge>);
      const badge = screen.getByText('Active Status');
      expect(badge).toBeDefined();
      expect(badge.className).toContain('bg-primary');
    });

    it('renders outline badge variant', () => {
      render(<Badge variant="outline">14-Day Trial</Badge>);
      const badge = screen.getByText('14-Day Trial');
      expect(badge.className).toContain('text-foreground');
    });
  });

  describe('Input Component', () => {
    it('renders text input with expected placeholder and type', () => {
      render(<Input placeholder="Enter your email" type="email" />);
      const input = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
      expect(input.type).toBe('email');
      expect(input.className).toContain('rounded-md');
    });
  });

  describe('Skeleton Component', () => {
    it('renders pulse animation placeholder', () => {
      const { container } = render(<Skeleton className="h-4 w-32" />);
      const skel = container.firstChild as HTMLElement;
      expect(skel.className).toContain('animate-pulse');
      expect(skel.className).toContain('h-4 w-32');
    });
  });

  describe('Card Component Family', () => {
    it('renders card hierarchy', () => {
      render(
        <Card data-testid="card-box">
          <CardHeader>
            <CardTitle>Merchant Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Body Content</p>
          </CardContent>
        </Card>
      );
      const card = screen.getByTestId('card-box');
      expect(card.className).toContain('rounded-xl');
      expect(screen.getByText('Merchant Card Title')).toBeDefined();
      expect(screen.getByText('Body Content')).toBeDefined();
    });
  });
});

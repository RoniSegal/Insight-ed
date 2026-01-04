import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import React from 'react';

import { LogoutButton } from '@/components/auth/LogoutButton';
import { useAuthStore } from '@/lib/auth/auth-store';

jest.mock('next/navigation');
jest.mock('@/lib/auth/auth-store');

describe('LogoutButton', () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ logout: mockLogout })
    );
  });

  describe('Rendering', () => {
    it('should render logout button', () => {
      render(<LogoutButton />);
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('should have correct button text', () => {
      render(<LogoutButton />);
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should have correct styling classes', () => {
      render(<LogoutButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm', 'bg-blue-600');
    });
  });

  describe('Logout functionality', () => {
    it('should call logout when clicked', async () => {
      mockLogout.mockResolvedValue(undefined);
      render(<LogoutButton />);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should redirect to login after logout', async () => {
      mockLogout.mockResolvedValue(undefined);
      render(<LogoutButton />);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    it('should handle logout error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLogout.mockRejectedValue(new Error('Logout failed'));
      render(<LogoutButton />);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });
  });
});

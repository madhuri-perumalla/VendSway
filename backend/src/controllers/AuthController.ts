import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';
import { authService } from '../services/AuthService';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'SELLER';
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface VerifyEmailRequest {
  token: string;
}

interface RequestPasswordResetRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profilePicture?: string;
}

/**
 * Authentication controller with JWT tokens
 * Handles registration, login, token refresh, email verification, and password management
 */
export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, role } = req.body as RegisterRequest;

    if (!email || !password || !name || !role) {
      throw new BadRequestError('Email, password, name, and role are required');
    }

    const result = await authService.register({ email, password, name, role });

    // Set refresh token in httpOnly cookie
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    return successResponse(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      'User registered successfully. Please check your email to verify your account.',
      201
    );
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const result = await authService.login({ email, password });

    // Set refresh token in httpOnly cookie
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    return successResponse(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      'Login successful'
    );
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as RefreshTokenRequest;
    const cookieRefreshToken = req.cookies.refresh_token;

    const tokenToUse = refreshToken || cookieRefreshToken;

    if (!tokenToUse) {
      throw new BadRequestError('Refresh token is required');
    }

    const result = await authService.refreshAccessToken(tokenToUse);

    // Set new refresh token in httpOnly cookie
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    return successResponse(
      res,
      {
        accessToken: result.accessToken,
      },
      'Access token refreshed successfully'
    );
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refresh_token');

    return successResponse(res, { success: true }, 'Logged out successfully');
  });

  /**
   * Verify email
   * POST /api/auth/verify-email
   */
  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body as VerifyEmailRequest;

    if (!token) {
      throw new BadRequestError('Verification token is required');
    }

    const result = await authService.verifyEmail(token);

    if (!result.success) {
      throw new BadRequestError(result.message);
    }

    return successResponse(res, { success: true }, result.message);
  });

  /**
   * Request password reset
   * POST /api/auth/request-password-reset
   */
  requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as RequestPasswordResetRequest;

    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const result = await authService.requestPasswordReset(email);

    return successResponse(res, { success: true }, result.message);
  });

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body as ResetPasswordRequest;

    if (!token || !newPassword) {
      throw new BadRequestError('Token and new password are required');
    }

    if (newPassword.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters long');
    }

    const result = await authService.resetPassword(token, newPassword);

    if (!result.success) {
      throw new BadRequestError(result.message);
    }

    return successResponse(res, { success: true }, result.message);
  });

  /**
   * Get current user
   * GET /api/auth/me
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const user = await authService.getCurrentUser(userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return successResponse(res, { user }, 'User retrieved successfully');
  });

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { name, phone, profilePicture } = req.body as UpdateProfileRequest;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const updatedUser = await authService.updateProfile(userId, { name, phone, profilePicture });

    return successResponse(res, { user: updatedUser }, 'Profile updated successfully');
  });

  /**
   * Change password (authenticated)
   * POST /api/auth/change-password
   */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { currentPassword, newPassword } = req.body as ChangePasswordRequest;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!currentPassword || !newPassword) {
      throw new BadRequestError('Current password and new password are required');
    }

    if (newPassword.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters long');
    }

    const result = await authService.changePassword(userId, currentPassword, newPassword);

    if (!result.success) {
      throw new BadRequestError(result.message);
    }

    return successResponse(res, { success: true }, result.message);
  });
}

// Export singleton instance
export const authController = new AuthController();

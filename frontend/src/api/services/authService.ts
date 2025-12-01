import { apiClient } from '../apiClient';
import { User, TokenResponse, MessageResponse, UserCreate, UserLogin, PasswordReset, EmailVerification } from '../../types';

export const authService = {
    signup: async (data: UserCreate): Promise<User> => {
        return apiClient.post<User>('/api/v1/users/signup', data);
    },

    login: async (data: UserLogin): Promise<TokenResponse> => {
        return apiClient.post<TokenResponse>('/api/v1/login', data);
    },

    // ▼▼▼ UPDATED: Now accepts 'code' for Server-Side Verification ▼▼▼
    loginGoogle: async (code: string): Promise<TokenResponse> => {
        return apiClient.post<TokenResponse>('/api/v1/login/google', { code });
    },

    verifyEmail: async (data: EmailVerification): Promise<TokenResponse> => {
        return apiClient.post<TokenResponse>('/api/v1/verify-email', data);
    },

    resendVerification: async (email: string): Promise<MessageResponse> => {
        return apiClient.post<MessageResponse>(`/api/v1/resend-verification/${email}`, {});
    },

    requestPasswordRecovery: async (email: string): Promise<MessageResponse> => {
        return apiClient.post<MessageResponse>(`/api/v1/password-recovery/${email}`, {});
    },

    resetPassword: async (data: PasswordReset): Promise<MessageResponse> => {
        return apiClient.post<MessageResponse>('/api/v1/reset-password/', data);
    },

    getMe: async (): Promise<User> => {
        return apiClient.get<User>('/api/v1/users/me');
    }
};
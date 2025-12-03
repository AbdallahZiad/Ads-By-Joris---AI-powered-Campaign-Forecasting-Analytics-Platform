import { apiClient } from '../apiClient';
import { User, TokenResponse, MessageResponse, UserCreate, UserLogin, PasswordReset, EmailVerification } from '../../types';

export const authService = {
    signup: async (data: UserCreate): Promise<User> => {
        return apiClient.post<User>('/api/v1/users/signup', data);
    },

    login: async (data: UserLogin): Promise<TokenResponse> => {
        return apiClient.post<TokenResponse>('/api/v1/login', data);
    },

    loginGoogle: async (code: string): Promise<TokenResponse> => {
        return apiClient.post<TokenResponse>('/api/v1/login/google', { code });
    },

    // ▼▼▼ NEW: Link Google Ads ▼▼▼
    linkGoogleAds: async (code: string): Promise<MessageResponse> => {
        return apiClient.post<MessageResponse>('/api/v1/users/me/link-google-ads', {
            code,
            redirect_uri: 'http://localhost:8080' // Must match Google Console exactly
        });
    },

    verifyEmail: async (data: EmailVerification): Promise<TokenResponse> => {
        return apiClient.post<TokenResponse>('/api/v1/verify-email', data);
    },

    resendVerification: async (email: string): Promise<MessageResponse> => {
        return apiClient.post<MessageResponse>(`/api/v1/resend-verification?email=${encodeURIComponent(email)}`, {});
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
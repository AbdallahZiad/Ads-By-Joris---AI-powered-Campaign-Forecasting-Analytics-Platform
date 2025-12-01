const BASE_URL = 'http://127.0.0.1:8000'; // Updated to your provided backend URL

export const apiClient = {
    getToken: (): string | null => localStorage.getItem('accessToken'),

    getHeaders: (): HeadersInit => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    request: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...apiClient.getHeaders(),
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Error: ${response.statusText}`);
        }

        return response.json();
    },

    get: async <T>(endpoint: string): Promise<T> => {
        return apiClient.request<T>(endpoint, { method: 'GET' });
    },

    post: async <T>(endpoint: string, body: any): Promise<T> => {
        return apiClient.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    put: async <T>(endpoint: string, body: any): Promise<T> => {
        return apiClient.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        return apiClient.request<T>(endpoint, { method: 'DELETE' });
    }
};
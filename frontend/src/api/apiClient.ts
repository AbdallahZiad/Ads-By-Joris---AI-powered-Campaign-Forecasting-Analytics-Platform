// Ideally, this comes from an environment variable like import.meta.env.VITE_API_URL
// For now, change this to your actual backend URL (e.g., http://localhost:8000)
const BASE_URL = 'http://localhost:8000';

export const apiClient = {
    post: async <T>(endpoint: string, body: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Error: ${response.statusText}`);
        }

        return response.json();
    },

    // We will add get/put/delete here later as needed
};
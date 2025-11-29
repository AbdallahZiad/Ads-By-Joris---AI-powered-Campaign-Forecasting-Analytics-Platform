import { apiClient } from '../apiClient';
import { ScannerConfig, ScannerResponse } from '../../types';

export const scannerService = {
    scanWebsite: async (config: ScannerConfig): Promise<ScannerResponse> => {
        // Mapping internal config types to exact API expectations if needed,
        // but currently they match perfectly based on your context.
        return apiClient.post<ScannerResponse>('/api/v1/ai-scan/', config);
    }
};
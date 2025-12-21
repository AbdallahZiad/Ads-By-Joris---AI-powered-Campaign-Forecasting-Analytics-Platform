import { apiClient } from '../apiClient';
import { AsyncTaskInitResponse, ScannerConfig } from '../../types';

export const scannerService = {
    startScan: async (config: ScannerConfig): Promise<AsyncTaskInitResponse> => {
        return apiClient.post<AsyncTaskInitResponse>('/api/v1/ai-scan/', config);
    }
};
import { useMutation } from '@tanstack/react-query';
import { scannerService } from '../api/services/scannerService';
import { ScannerConfig, ScannerResponse } from '../types';

export const useScanner = () => {
    return useMutation<ScannerResponse, Error, ScannerConfig>({
        mutationFn: (config) => scannerService.scanWebsite(config),
        onSuccess: (data) => {
            console.log("Scan successful:", data);
        },
        onError: (error) => {
            console.error("Scan failed:", error);
        }
    });
};
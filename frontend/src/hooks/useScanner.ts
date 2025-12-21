import { useMutation } from '@tanstack/react-query';
import { ScannerConfig, ScannerResponse } from '../types';
import { scannerService } from '../api/services/scannerService';
import { useTaskPoller } from './useTaskPoller';
import { useRef } from 'react';

export const useScanner = () => {
    // ▼▼▼ FIX: Use useRef instead of useState to avoid stale closures in callbacks ▼▼▼
    const resolveRef = useRef<((value: ScannerResponse) => void) | null>(null);
    const rejectRef = useRef<((reason?: any) => void) | null>(null);

    const poller = useTaskPoller<ScannerResponse>({
        onSuccess: (data) => {
            if (resolveRef.current) {
                resolveRef.current(data);
                // Cleanup
                resolveRef.current = null;
                rejectRef.current = null;
            }
        },
        onError: (err) => {
            if (rejectRef.current) {
                rejectRef.current(new Error(err));
                // Cleanup
                resolveRef.current = null;
                rejectRef.current = null;
            }
        }
    });

    const mutation = useMutation({
        mutationFn: async (config: ScannerConfig) => {
            // 1. Return a promise that waits for polling to complete
            return new Promise<ScannerResponse>(async (resolve, reject) => {
                // Store the resolvers in the ref so the poller can access them later
                resolveRef.current = resolve;
                rejectRef.current = reject;

                try {
                    // 2. Start Task
                    const response = await scannerService.startScan(config);

                    // 3. Start Polling
                    poller.startPolling(response.task_id);
                } catch (e) {
                    // If the initial launch fails, reject immediately
                    reject(e);
                    resolveRef.current = null;
                    rejectRef.current = null;
                }
            });
        }
    });

    return {
        ...mutation,
        // Override isPending to track the polling status too
        isPending: mutation.isPending || poller.isLoading
    };
};
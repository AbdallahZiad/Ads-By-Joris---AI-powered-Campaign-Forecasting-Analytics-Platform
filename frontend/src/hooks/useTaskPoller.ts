import { useState, useRef, useEffect, useCallback } from 'react';
import { taskService } from '../api/services/taskService';

interface UseTaskPollerOptions<T> {
    onSuccess?: (result: T) => void;
    onError?: (error: string) => void;
    pollInterval?: number; // ms
}

export const useTaskPoller = <T>({ onSuccess, onError, pollInterval = 2000 }: UseTaskPollerOptions<T> = {}) => {
    const [taskId, setTaskId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('IDLE');
    const [result, setResult] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ▼▼▼ FIX: Browser-compatible Timer Type ▼▼▼
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startPolling = useCallback((newTaskId: string) => {
        setTaskId(newTaskId);
        setStatus('PENDING');
        setResult(null);
        setError(null);

        // Clear any existing poll
        stopPolling();

        intervalRef.current = setInterval(async () => {
            try {
                const response = await taskService.getTaskStatus<T>(newTaskId);

                setStatus(response.status);

                if (response.status === 'SUCCESS') {
                    setResult(response.result);
                    stopPolling();
                    if (onSuccess && response.result) {
                        onSuccess(response.result);
                    }
                } else if (response.status === 'FAILURE') {
                    const errorMsg = response.error || 'Unknown error occurred';
                    setError(errorMsg);
                    stopPolling();
                    if (onError) {
                        onError(errorMsg);
                    }
                }
                // If PENDING or STARTED, continue polling...
            } catch (err: any) {
                console.error("Polling error:", err);
                // We typically continue polling on network hiccups unless it's a 4xx error
            }
        }, pollInterval);
    }, [onSuccess, onError, pollInterval, stopPolling]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    return {
        startPolling,
        stopPolling,
        taskId,
        status,
        isLoading: status === 'PENDING' || status === 'STARTED',
        result,
        error
    };
};
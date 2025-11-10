import { Month } from './types';

// Elegant color palette for charts and UI elements
export const COLORS = [
    '#059669', '#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b',
    '#ec4899', '#14b8a6', '#6366f1', '#a855f7', '#d946ef',
    '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6b7280',
    '#f43f5e', '#7c3aed', '#db2777', '#0891b2', '#be185d',
];

// Mapping month enums to 0-indexed integers for Date objects
export const MONTH_MAP: Record<Month, number> = {
    "JANUARY": 0, "FEBRUARY": 1, "MARCH": 2, "APRIL": 3, "MAY": 4, "JUNE": 5,
    "JULY": 6, "AUGUST": 7, "SEPTEMBER": 8, "OCTOBER": 9, "NOVEMBER": 10, "DECEMBER": 11,
    "UNSPECIFIED": 0
};
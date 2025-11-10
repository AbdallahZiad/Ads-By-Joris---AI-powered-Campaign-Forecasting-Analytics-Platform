/**
 * robustly normalizes a keyword string for comparison.
 * Lowercases, strips non-alphanumeric characters, and collapses spaces.
 * e.g., "Playstation 5 (PS5)" -> "playstation 5 ps5"
 */
export const normalize = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
};
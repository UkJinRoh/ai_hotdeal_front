export const STORAGE_KEY = 'reported_items';

export const getReportedItems = (): number[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addReportedItem = (id: number) => {
    if (typeof window === 'undefined') return;
    const items = getReportedItems();
    if (!items.includes(id)) {
        items.push(id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
};

export const isItemReported = (id: number): boolean => {
    if (typeof window === 'undefined') return false;
    const items = getReportedItems();
    return items.includes(id);
};

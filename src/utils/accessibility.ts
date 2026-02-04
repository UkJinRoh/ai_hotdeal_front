
/**
 * Extracts a human-readable store name from a given URL.
 * Used for generating meaningful alt text for accessibility key.
 */
export const getStoreNameFromUrl = (url: string | undefined | null): string => {
    if (!url) return '알 수 없는 스토어';

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('naver')) return '네이버';
    if (lowerUrl.includes('auction')) return '옥션';
    if (lowerUrl.includes('11st')) return '11번가';
    if (lowerUrl.includes('coupang')) return '쿠팡';
    if (lowerUrl.includes('gmarket')) return 'G마켓';
    if (lowerUrl.includes('lotte')) return '롯데';
    if (lowerUrl.includes('toss')) return '토스';
    if (lowerUrl.includes('ohou')) return '오늘의집';
    if (lowerUrl.includes('wemakeprice') || lowerUrl.includes('wmp')) return '위메프';
    if (lowerUrl.includes('tmon')) return '티몬';
    if (lowerUrl.includes('ssg')) return 'SSG';
    if (lowerUrl.includes('cj')) return 'CJ';
    if (lowerUrl.includes('gs')) return 'GS Shop';

    // Fallback: try to get hostname
    try {
        const u = new URL(url);
        return u.hostname;
    } catch (e) {
        return '쇼핑몰';
    }
};

export const formatPrice = (price: string | number | null | undefined): string => {
    if (price === null || price === undefined) return '가격 정보 없음';

    const priceString = String(price);
    // Remove all non-numeric characters
    const numericString = priceString.replace(/[^0-9]/g, '');

    const parsedPrice = parseInt(numericString, 10);

    if (isNaN(parsedPrice)) return '가격 정보 없음';

    return `${parsedPrice.toLocaleString()}원`;
};

export const extractPriceFromTitle = (title: string): number | null => {
    if (!title) return null;

    // Strategy 1: Look for patterns like "18,900원", "18.900원", "18900원"
    // We want to capture the number part before "원", "kw", "krw"
    // We allow allow for spaces between number and unit.
    // We treat both ',' and '.' as potential thousands separators if they are roughly every 3 digits, 
    // BUT for "18.900" specifically, the user said it's a thousands separator.

    // Regex explanation:
    // ([0-9]+(?:[.,][0-9]+)*)  -> Capture a number, potentially with . or , separators
    // \s*                      -> Optional whitespace
    // (?:원|kw|krw)            -> Must be followed by a price unit
    const priceWithUnitRegex = /([0-9]+(?:[.,][0-9]{3})*)\s*(?:원|kw|krw)/i;

    const match = title.match(priceWithUnitRegex);

    if (match) {
        // match[1] is the number part, e.g. "18.900" or "18,900"
        let rawNumber = match[1];
        // Remove . and ,
        rawNumber = rawNumber.replace(/[.,]/g, '');
        const parsed = parseInt(rawNumber, 10);
        if (!isNaN(parsed)) return parsed;
    }

    // fallback: if no unit found, it's risky to just pick a number. 
    // But maybe we can look for specific "hot deal" formats if needed.
    // For now, let's stick to unit-based extraction as it's safest.

    return null;
};

export const getDisplayPrice = (dbPrice: string | number | null | undefined, title: string): string => {
    const extractedPrice = extractPriceFromTitle(title);

    if (extractedPrice !== null) {
        return `${extractedPrice.toLocaleString()}원`;
    }

    return formatPrice(dbPrice);
};

export const getPriceInfo = (price: string | number | null | undefined, title: string): { price: number; originalPrice: number } => {
    let displayPrice = 0;

    // 1. Try to extract from title
    const extracted = extractPriceFromTitle(title);
    if (extracted !== null) {
        displayPrice = extracted;
    } else if (price !== null && price !== undefined) {
        // 2. Fallback to DB price
        const numericString = String(price).replace(/[^0-9]/g, '');
        const parsed = parseInt(numericString, 10);
        if (!isNaN(parsed)) displayPrice = parsed;
    }

    return {
        price: displayPrice,
        originalPrice: 0
    };
};

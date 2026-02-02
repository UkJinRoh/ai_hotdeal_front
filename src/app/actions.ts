'use server';

import { supabase } from '@/lib/supabase';

// Helper to filter out community links that might have slipped through
function isValidLink(link: string) {
    if (!link) return false;

    // 커뮤니티 도메인 필터링
    const communityDomains = [
        'ppomppu.co.kr',
        'fmkorea.com',
        'quasarzone.com',
        'arca.live',
        'coolenjoy.net',
        'ruliweb.com'
    ];
    return !communityDomains.some(domain => link.includes(domain));
}

// Helper to remove duplicates by title
function removeDuplicatesByTitle(items: any[]) {
    const uniqueItems = [];
    const seenTitles = new Set();

    for (const item of items) {
        // Trim and check for exact match
        const title = item.title?.trim();
        if (title && !seenTitles.has(title)) {
            seenTitles.add(title);
            uniqueItems.push(item);
        }
    }
    return uniqueItems;
}

// 1~5. Category Top 10
export async function getCategoryTop10(category: string) {
    // Logic: Score > Votes (Recommendations) > Comment Count
    const { data, error } = await supabase
        .from('hotdeals')
        .select('*')
        .eq('category', category)
        .order('score', { ascending: false })
        .order('votes', { ascending: false })
        .order('comment_count', { ascending: false })
        .limit(50); // Fetch more to allow for filtering

    if (error) {
        console.error(`Error fetching ${category}:`, error);
        throw error;
    }

    console.log(`[actions] Category: ${category}, Fetched: ${data?.length}`);

    // Filter invalid links
    let filteredData = data.filter(item => isValidLink(item.link || item.url));

    // Filter duplicates
    filteredData = removeDuplicatesByTitle(filteredData);

    return filteredData.slice(0, 10);
}

// 6. Overall Top 10
export async function getOverallTop10() {
    // Logic: Score > Votes (Recommendations) > Comment Count
    const { data, error } = await supabase
        .from('hotdeals')
        .select('*')
        .order('score', { ascending: false })
        .order('votes', { ascending: false })
        .order('comment_count', { ascending: false })
        .limit(50);

    if (error) throw error;

    // Filter invalid links
    let filteredData = data.filter(item => isValidLink(item.link || item.url));

    // Filter duplicates
    filteredData = removeDuplicatesByTitle(filteredData);

    return filteredData.slice(0, 10);
}

// 7. Date-wise Popularity (Hotdeals by Date)
export async function getDatePopularity(page: number = 1, limit: number = 20, sort: 'latest' | 'oldest' | 'popular' = 'latest') {
    // console.log(`[getDatePopularity] Page: ${page}, Limit: ${limit}, Sort: ${sort}`);
    const from = (page - 1) * limit;
    // Fetch significantly more to account for dupes and invalid links
    const fetchLimit = Math.ceil(limit * 2.5);
    const fetchTo = from + fetchLimit - 1;

    let query;
    const baseQuery = supabase.from('hotdeals').select('*');

    if (sort === 'oldest') {
        query = baseQuery.order('created_at', { ascending: true });
    } else if (sort === 'popular') {
        // Logic: Score > Votes > Comment Count
        query = baseQuery
            .order('score', { ascending: false })
            .order('votes', { ascending: false })
            .order('comment_count', { ascending: false });
    } else {
        // Default: latest
        query = baseQuery.order('created_at', { ascending: false });
    }

    const { data, error } = await query.range(from, fetchTo);

    if (error) throw error;

    // Filter invalid links
    let filteredData = data?.filter(item => isValidLink(item.link || item.url)) || [];

    // Filter duplicates
    filteredData = removeDuplicatesByTitle(filteredData);

    // Return requested amount
    return filteredData.slice(0, limit);
}

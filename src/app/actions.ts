'use server';

import { supabase } from '@/lib/supabase';

// 도메인 필터링 함수
function isValidLink(link: string) {
    if (!link) return false;

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

// 신고 횟수 증가 함수
export async function incrementReportCount(id: string | number) {
    const { data: current, error: fetchError } = await supabase
        .from('hotdeals')
        .select('report_count')
        .eq('id', id)
        .single();

    if (fetchError) {
        console.error("Error fetching report count:", fetchError);
        return { success: false, error: fetchError };
    }

    const newCount = (current?.report_count || 0) + 1;

    const { error: updateError } = await supabase
        .from('hotdeals')
        .update({ report_count: newCount })
        .eq('id', id);

    if (updateError) {
        console.error("Error updating report count:", updateError);
        return { success: false, error: updateError };
    }

    return { success: true };
}

// 이름 중복 제거 함수
function removeDuplicatesByTitle(items: any[]) {
    const uniqueItems = [];
    const seenTitles = new Set();

    for (const item of items) {
        const title = item.title?.trim();
        if (title && !seenTitles.has(title)) {
            seenTitles.add(title);
            uniqueItems.push(item);
        }
    }
    return uniqueItems;
}

// 카테고리별 인기글 함수
export async function getCategoryTop10(category: string) {
    // Logic: 점수 > 추천수 > 댓글수
    const { data, error } = await supabase
        .from('hotdeals')
        .select('*')
        .eq('category', category)
        .lt('report_count', 2)
        .order('score', { ascending: false })
        .order('votes', { ascending: false })
        .order('comment_count', { ascending: false })
        .limit(50);

    if (error) {
        console.error(`Error fetching ${category}:`, error);
        throw error;
    }

    console.log(`[actions] Category: ${category}, Fetched: ${data?.length}`);

    let filteredData = data.filter(item => isValidLink(item.link || item.url));
    filteredData = removeDuplicatesByTitle(filteredData);
    return filteredData.slice(0, 10);
}

// 전체 인기글 함수
export async function getOverallTop10() {
    // Logic: 점수 > 추천수 > 댓글수
    const { data, error } = await supabase
        .from('hotdeals')
        .select('*')
        .lt('report_count', 2)
        .order('score', { ascending: false })
        .order('votes', { ascending: false })
        .order('comment_count', { ascending: false })
        .limit(50);

    if (error) throw error;

    let filteredData = data.filter(item => isValidLink(item.link || item.url));
    filteredData = removeDuplicatesByTitle(filteredData);
    return filteredData.slice(0, 10);
}

// 날짜별 인기글 함수
export async function getDatePopularity(page: number = 1, limit: number = 20, sort: 'latest' | 'oldest' | 'popular' = 'latest', searchQuery: string = '') {
    const from = (page - 1) * limit;
    const fetchLimit = Math.ceil(limit * 2.5);
    const fetchTo = from + fetchLimit - 1;

    let query;
    const baseQuery = supabase.from('hotdeals').select('*').lt('report_count', 2);

    if (searchQuery) {
        baseQuery.ilike('title', `%${searchQuery}%`);
    }

    if (sort === 'oldest') {
        query = baseQuery.order('created_at', { ascending: true });
    } else if (sort === 'popular') {
        // Logic: 점수 > 추천수 > 댓글수
        query = baseQuery
            .order('score', { ascending: false })
            .order('votes', { ascending: false })
            .order('comment_count', { ascending: false });
    } else {
        query = baseQuery.order('created_at', { ascending: false });
    }

    const { data, error } = await query.range(from, fetchTo);

    if (error) throw error;

    let filteredData = data?.filter(item => isValidLink(item.link || item.url)) || [];
    filteredData = removeDuplicatesByTitle(filteredData);
    return filteredData.slice(0, limit);
}

// 크롤링 통계 및 AI 분석 함수
export async function getCrawlStats() {
    const { data, error } = await supabase
        .from('crawl_stats')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

    const latestDate = new Date(data[0].created_at).toISOString().split('T')[0];

    const dailyStats = data.filter(item => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0];
        return itemDate === latestDate;
    });

    const aggregatedStats = dailyStats.reduce((acc, curr) => {
        return {
            total_items: acc.total_items + (curr.total_items || 0),
            hotdeal_items: acc.hotdeal_items + (curr.hotdeal_items || 0),
            filtered_items: acc.filtered_items + (curr.filtered_items || 0),
            community_count: Math.max(acc.community_count, curr.community_count || 0),
            created_at: latestDate
        };
    }, {
        total_items: 0,
        hotdeal_items: 0,
        filtered_items: 0,
        community_count: 0
    });

    return [aggregatedStats];
}
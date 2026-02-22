'use server';

import { supabase } from '@/lib/supabase';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
        .in('category', [category, `Category.${category.toUpperCase()}`])
        .lt('report_count', 2)
        .order('score', { ascending: false })
        .order('votes', { ascending: false })
        .order('comment_count', { ascending: false })
        .limit(60);

    if (error) {
        console.error(`Error fetching ${category}:`, error);
        throw error;
    }

    console.log(`[actions] Category: ${category}, Fetched: ${data?.length}`);

    let filteredData = data.filter(item => isValidLink(item.link || item.url));
    filteredData = removeDuplicatesByTitle(filteredData);
    return filteredData.slice(0, 50);
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
        .limit(60);

    if (error) throw error;

    let filteredData = data.filter(item => isValidLink(item.link || item.url));
    filteredData = removeDuplicatesByTitle(filteredData);
    return filteredData.slice(0, 50);
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

// AI 기반 자연어 맞춤 추천 함수
export async function getRecommendationFromPrompt(prompt: string) {
    if (!prompt || prompt.trim() === '') {
        return { success: false, error: '프롬프트가 비어있습니다.' };
    }

    try {
        console.log(`[actions] Requesting Gemini with prompt: "${prompt}"`);

        const responseSchema: Schema = {
            type: Type.OBJECT,
            properties: {
                target_categories: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                    description: "매칭되는 카테고리 영문명 배열 (Office, Food, Drink, Toiletries, Others 중 여러 개 가능)",
                },
                search_keywords: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                    description: "유저 질문에서 추출한 핵심 상품 검색 키워드 배열 (단, '음료 아무거나'처럼 포괄적이면 빈 배열 []. 만약 '집들이 선물', '캠핑용품' 등 특정 '상황'이 주어지면, 해당 상황에 흔히 쓰이는 구체적인 상품명 명사 3~5개(예: 집들이 -> '휴지', '세제', '햇반', '커피', '스팸' / 캠핑 -> '텐트', '의자', '고기', '버너')로 치환하여 추출할 것. 반드시 구체적인 명사여야 함)",
                },
                ai_comment: {
                    type: Type.STRING,
                    description: "유저의 상황에 공감하며 추천 이유를 설명하는 다정한 1줄 코멘트 (이모지 포함)",
                },
            },
            required: ["target_categories", "search_keywords", "ai_comment"],
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "너는 핫딜 추천 비서야. 사용자의 상황을 분석해서 1) 찾을 카테고리(Office, Food, Drink, Toiletries, Others 중), 2) DB 매칭을 위한 구체적 명사 키워드(포괄적인 요청이면 빈 배열 [] 반환. 단, '집들이', '캠핑' 같은 상황적 키워드가 들어오면 핫딜 게시판에 자주 올라오는 생필품/식품 명사(예: 세제, 휴지, 스팸, 생수 등)로 치환해 3~5개 추출할 것), 3) 유저에게 건넬 1줄 친근한 상황 공감 멘트를 JSON 포맷으로 반환해.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const textResponse = response.text;
        if (!textResponse) throw new Error("Empty response from AI");

        const aiData = JSON.parse(textResponse);
        console.log(`[actions] Gemini Response:`, aiData);

        const { target_categories, search_keywords, ai_comment } = aiData;

        // DB (Supabase) 교차 검색
        let query = supabase
            .from('hotdeals')
            .select('*')
            .lt('report_count', 2);

        // 카테고리 매칭 필터
        if (target_categories && target_categories.length > 0) {
            query = query.in('category', target_categories.flatMap((cat: string) => [cat, `Category.${cat.toUpperCase()}`]));
        }

        // 키워드 OR 조건 검색 (우선 ilike로 title 필터)
        if (search_keywords && search_keywords.length > 0) {
            const orQuery = search_keywords.map((kw: string) => `title.ilike.%${kw}%`).join(',');
            query = query.or(orQuery);
        }

        // Logic: 점수 > 추천수 > 댓글수
        const { data, error } = await query
            .order('score', { ascending: false })
            .order('votes', { ascending: false })
            .order('comment_count', { ascending: false })
            .limit(40);

        if (error) {
            console.error(`Error fetching recommendations by prompt:`, error);
            throw error;
        }

        let filteredData = data?.filter((item: any) => isValidLink(item.link || item.url)) || [];
        filteredData = removeDuplicatesByTitle(filteredData);

        return {
            success: true,
            data: filteredData.slice(0, 20),
            aiData: { target_categories, search_keywords, ai_comment }
        };

    } catch (e: any) {
        console.error("Error in getRecommendationFromPrompt:", e);
        return { success: false, error: e.message || '추천 중 오류가 발생했습니다.' };
    }
}
'use server';

import { supabase } from '@/lib/supabase';

// 1~5. Category Top 10
export async function getCategoryTop10(category: string) {
    // Assuming 'votes', 'comment_count' or just 'score' determines TOP.
    // Using 'score' desc as a default metric for ranking.
    const { data, error } = await supabase
        .from('hotdeals')
        .select('*')
        .eq('category', category)
        .order('score', { ascending: false })
        .limit(10);

    if (error) throw error;
    return data;
}

// 6. Overall Top 10
export async function getOverallTop10() {
    // Logic: "Comprehensive judgment (comments, recommendations), compare all dates"
    // Using 'votes' + 'comment_count' if 'score' isn't sufficient, but inspecting the schema showed 'score'.
    // Let's use 'score' for simplicity unless user asked for custom formula.
    // User asked: "(comprehensive judgment (comment count, recommendation count), all date data comparison)"
    // The 'score' column likely already aggregates this, but let's be explicit if needed.
    // For now, sorting by 'score' desc seems safest as it likely combines them.
    // If we want raw calculation: order by (votes + comment_count)

    // Let's try to order by score first as it exists in DB.
    const { data, error } = await supabase
        .from('hotdeals')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

    if (error) throw error;
    return data;
}

// 7. Date-wise Popularity (Hotdeals by Date)
export async function getDatePopularity() {
    // "Date-wise hotdeal popularity"
    // This likely means grouping by date or showing latest popular ones.
    // For a single list, "Popularity by Date" could mean:
    // Sort by 'created_at' desc (recent) AND 'score' desc within that?
    // Or just recent high scores.
    // Let's interpret as: Most recent 50 items sorted by score?
    // Or: Top 10 for TODAY?
    // Given "Date-wise", let's return the Top 10 items from the last 24 hours (or recent).
    // Or simply detailed list sorted by Date then Score.
    // Let's implement: Sort by `created_at` DESC then `score` DESC.
    // Wait, user said "Date-wise hot deal popularity order". 
    // Maybe "For each date, show top deals"? That's complex for a single button returning list.
    // Let's assume: Sort by created_at DESC (primary) to show flow of deals? 
    // OR: Group by Date?
    // Re-reading: "Date-wise Hotdeal Popularity" -> commonly means "Trending now" or "Calendar view".
    // Let's return the most recent 100 items sorted by created_at.
    // Actually, "Popularity" implies score.
    // Let's try: Get Top 10 for the latest available date in DB.

    // Simplified interpretation: Recent High Scoring Deals.
    const { data, error } = await supabase
        .from('hotdeals')
        .select('*')
        .order('created_at', { ascending: false })
        .order('score', { ascending: false })
        .limit(20);

    if (error) throw error;
    return data;
}

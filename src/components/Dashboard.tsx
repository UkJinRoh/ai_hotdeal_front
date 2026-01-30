'use client';

import { getCategoryTop10, getOverallTop10, getDatePopularity } from '@/app/actions';

export default function Dashboard() {
    const categories = ['Food', 'Drink', 'Office', 'Drop', 'Toiletries'];

    const handleCategoryClick = async (cat: string) => {
        console.log(`Fetching Top 10 for ${cat}...`);
        try {
            const data = await getCategoryTop10(cat);
            console.log(`[${cat} Top 10]:`, data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleOverallClick = async () => {
        console.log('Fetching Overall Top 10...');
        try {
            const data = await getOverallTop10();
            console.log('[Overall Top 10]:', data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDateClick = async () => {
        console.log('Fetching Date-wise Popularity...');
        try {
            const data = await getDatePopularity();
            console.log('[Date-wise Popularity]:', data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '20px 0' }}>
            {/* 1~5 Categories */}
            {categories.map((cat) => (
                <button key={cat} onClick={() => handleCategoryClick(cat)}>
                    {cat} Top 10
                </button>
            ))}

            {/* 6 Overall */}
            <button onClick={handleOverallClick} style={{ backgroundColor: '#e0f7fa' }}>
                Overall Top 10
            </button>

            {/* 7 Date-wise */}
            <button onClick={handleDateClick} style={{ backgroundColor: '#fff3e0' }}>
                Date-wise Popularity
            </button>
        </div>
    );
}

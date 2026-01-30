'use client';

import { useEffect } from 'react';
import { getCategoryTop10 } from '@/app/actions';
import styles from './CategoryTop.module.scss';

export default function CategoryTop() {
    const categories = ['Food', 'Drink', 'Office', 'Drop', 'Toiletries'];

    useEffect(() => {
        const fetchAllCategories = async () => {
            console.log("Fetching all category data...");
            await Promise.all(categories.map(async (cat) => {
                try {
                    const data = await getCategoryTop10(cat);
                    console.log(`[${cat} Top 10]:`, data);
                } catch (e) {
                    console.error(`Error fetching ${cat}:`, e);
                }
            }));
        };

        fetchAllCategories();
    }, []);

    return (
        <div className={styles.container}>
            {categories.map((cat) => (
                <button key={cat} type="button" className='buttonimsi'>
                    {cat} Top 10
                </button>
            ))}
        </div>
    );
}

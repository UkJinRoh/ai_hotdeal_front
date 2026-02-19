'use client';

import { supabase } from "../lib/supabase";
import { getCategoryTop10 } from '@/app/actions';
import CategoryCard from "./CategoryCard";
import SkeletonCard from './SkeletonCard';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface CategoryContainerProps {
    categories?: string[];
    isLoading?: boolean;
}

export default function CategoryContainer({
    categories = ['Food', 'Drink', 'Office', 'Others', 'TOILETRIES'],
    isLoading = false
}: CategoryContainerProps) {
    const [categoryData, setCategoryData] = useState<Record<string, any[]>>({});
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const fetchAllCategories = async () => {
            const results: Record<string, any[]> = {};

            await Promise.all(categories.map(async (category) => {
                try {
                    const data = await getCategoryTop10(category);
                    results[category] = data || [];
                } catch (e) {
                    console.error(`Error fetching ${category}:`, e);
                }
            }));

            setCategoryData(results);
            setIsInitialLoading(false);
        };

        fetchAllCategories();
    }, []);

    const getCategoryTitle = (category: string) => {
        switch (category) {
            case 'Food': return '식품';
            case 'Drink': return '음료';
            case 'Office': return '사무용품';
            case 'Others': return '기타';
            case 'Toiletries': return '생활용품';
            default: return category;
        }
    };

    const showSkeleton = isLoading || isInitialLoading;

    return (
        <Container>
            <h2>카테고리별 핫딜 정보</h2>

            <TabList>
                {categories.map((category) => (
                    <TabButton
                        key={category}
                        $active={activeCategory === category}
                        onClick={() => setActiveCategory(category)}
                    >
                        {getCategoryTitle(category)}
                    </TabButton>
                ))}
            </TabList>

            <ContentWrapper>
                {showSkeleton ? (
                    <SkeletonGrid>
                        {[...Array(4)].map((_, i) => (
                            <SkeletonWrapper key={i}>
                                <SkeletonCard />
                            </SkeletonWrapper>
                        ))}
                    </SkeletonGrid>
                ) : (
                    <CategoryCard key={activeCategory} category={activeCategory} items={categoryData[activeCategory] || []} />
                )}
            </ContentWrapper>
        </Container>
    );
}

const SkeletonGrid = styled.div`
    display: flex;
    gap: 20px;
    padding-bottom: 20px;
    overflow: hidden;
`;

const SkeletonWrapper = styled.div`
    min-width: 280px;
    flex: 1;
    
    @media (max-width: 640px) {
        min-width: 85%; 
    }
`;


const Container = styled.div`
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;

  h2 {
      font-size: 24px;
      font-weight: 600;
  }


`;

const TabList = styled.div`
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const TabButton = styled.button<{ $active: boolean }>`
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px solid ${props => props.$active ? 'var(--primary)' : 'var(--border)'};
    background-color: ${props => props.$active ? 'var(--primary)' : 'transparent'};
    color: ${props => props.$active ? '#fff' : 'var(--text-secondary)'};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;

    &:hover {
        border-color: var(--primary);
        color: ${props => props.$active ? '#fff' : 'var(--text-primary)'};
    }
`;

const ContentWrapper = styled.div`
    width: 100%;
    min-height: 400px;
`;
'use client';

import { getDatePopularity } from '@/app/actions';
import TotalCard from "./TotalCard";
import { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

export default function TotalContainer() {
    const [items, setItems] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [sort, setSort] = useState<'latest' | 'oldest' | 'popular'>('latest');
    const observer = useRef<IntersectionObserver | null>(null);

    // Callback for the last element reference
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchItems = useCallback(async (pageNum: number, sortOption: 'latest' | 'oldest' | 'popular', isReset: boolean) => {
        setLoading(true);
        try {
            const newItems = await getDatePopularity(pageNum, 20, sortOption);

            if (newItems && newItems.length > 0) {
                setItems(prevItems => {
                    return isReset ? newItems : [...prevItems, ...newItems];
                });
            } else {
                if (isReset) setItems([]);
                setHasMore(false);
            }

            if (newItems && newItems.length < 20) {
                setHasMore(false);
            }

        } catch (e) {
            console.error("Error fetching date popularity:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect for page changes (Infinite Scroll)
    useEffect(() => {
        if (page > 1) {
            fetchItems(page, sort, false);
        }
    }, [page, fetchItems, sort]);

    // Effect for sort changes (Reset) and Initial Load
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchItems(1, sort, true);
    }, [sort, fetchItems]);

    const handleSortChange = (newSort: 'latest' | 'oldest' | 'popular') => {
        if (sort !== newSort) {
            setItems([]); // Clear UI immediately for feedback
            setSort(newSort);
        }
    };

    return (
        <Container>
            <Header>
                <h2>전체 핫딜</h2>
                <SortButtons>
                    <SortButton $active={sort === 'latest'} onClick={() => handleSortChange('latest')}>최신순</SortButton>
                    <SortButton $active={sort === 'oldest'} onClick={() => handleSortChange('oldest')}>오래된순</SortButton>
                    <SortButton $active={sort === 'popular'} onClick={() => handleSortChange('popular')}>인기순</SortButton>
                </SortButtons>
            </Header>
            <Grid>
                {items.map((item, index) => {
                    if (items.length === index + 1) {
                        return (
                            <div ref={lastElementRef} key={`${item.id}-${index}`}>
                                <TotalCard item={item} />
                            </div>
                        );
                    } else {
                        return (
                            <div key={`${item.id}-${index}`}>
                                <TotalCard item={item} />
                            </div>
                        );
                    }
                })}
            </Grid>
            {loading && <Loading>로딩중...</Loading>}
            {!hasMore && items.length > 0 && <EndOfList>모든 핫딜을 불러왔습니다.</EndOfList>}
        </Container>
    );
}

const Container = styled.div`
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  width: 100%;
  padding-bottom: 40px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
    h2 {
      font-size: 24px;
      font-weight: 600;
  }
`;

const SortButtons = styled.div`
    display: flex;
    gap: 8px;
`;

const SortButton = styled.button<{ $active: boolean }>`
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid ${props => props.$active ? '#006239' : '#444'};
    background-color: ${props => props.$active ? '#006239' : 'transparent'};
    color: ${props => props.$active ? '#fff' : '#aaa'};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        border-color: #00c853;
        color: #fff;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    width: 100%;
    min-height: 50vh;
    
    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
    
    @media (min-width: 1440px) {
        grid-template-columns: repeat(5, 1fr);
    }
`;

const Loading = styled.div`
    text-align: center;
    padding: 20px;
    color: #fff;
    font-size: 14px;
`;

const EndOfList = styled.div`
    text-align: center;
    padding: 20px;
    color: #888;
    font-size: 14px;
`;

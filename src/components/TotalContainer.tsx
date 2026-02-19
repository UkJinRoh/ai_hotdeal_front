'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getDatePopularity } from '@/app/actions';
import TotalCard from "./TotalCard";
import SkeletonCard from './SkeletonCard';
import styled from 'styled-components';

interface TotalContainerProps {
    isLoading?: boolean;
}

export default function TotalContainer({ isLoading = false }: TotalContainerProps) {
    const [items, setItems] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [sort, setSort] = useState<'latest' | 'oldest' | 'popular'>('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [localSearch, setLocalSearch] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading || isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, isLoading]);

    const fetchItems = useCallback(async (pageNum: number, sortOption: 'latest' | 'oldest' | 'popular', query: string, isReset: boolean) => {
        setLoading(true);
        try {
            const newItems = await getDatePopularity(pageNum, 20, sortOption, query);

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
            setIsInitialLoading(false);
        }
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchItems(page, sort, searchQuery, false);
        }
    }, [page, fetchItems, sort, searchQuery]);


    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchItems(1, sort, searchQuery, true);
    }, [sort, searchQuery, fetchItems]);

    const handleSortChange = (newSort: 'latest' | 'oldest' | 'popular') => {
        if (sort !== newSort) {
            setItems([]);
            setSort(newSort);
            setIsInitialLoading(true);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setItems([]);
        setPage(1);
        setHasMore(true);
        setSearchQuery(localSearch);
        setIsInitialLoading(true);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    const showSkeleton = isLoading || isInitialLoading || (loading && items.length === 0);

    return (
        <Container>
            <Header>
                <h2>전체 핫딜</h2>
                <SearchWrapper>
                    <SearchIconBtn onClick={toggleSearch} aria-label="검색 열기">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </SearchIconBtn>
                    <SearchForm onSubmit={handleSearch} $isOpen={isSearchOpen}>
                        <SearchInput
                            ref={searchInputRef}
                            placeholder="검색어 입력..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            $isOpen={isSearchOpen}
                        />
                    </SearchForm>
                </SearchWrapper>
                <SortButtons>
                    <SortButton $active={sort === 'latest'} onClick={() => handleSortChange('latest')}>최신순</SortButton>
                    <SortButton $active={sort === 'oldest'} onClick={() => handleSortChange('oldest')}>오래된순</SortButton>
                    <SortButton $active={sort === 'popular'} onClick={() => handleSortChange('popular')}>인기순</SortButton>
                </SortButtons>
            </Header>
            <Grid>
                {showSkeleton ? (
                    [...Array(8)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))
                ) : (
                    items.map((item, index) => {
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
                    })
                )}
            </Grid>
            {loading && <Loading>로딩중...</Loading>}
            {!hasMore && items.length > 0 && <EndOfList>모든 핫딜을 불러왔습니다.</EndOfList>}
        </Container>
    );
}

const SearchWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    margin-right: auto;
    margin-left: 12px;

    @media (max-width: 768px) {
        order: 3; 
        width: 100%;
        margin: 10px 0 0 0;
    }
`;

const SearchForm = styled.form<{ $isOpen: boolean }>`
    width: ${props => props.$isOpen ? '300px' : '0px'};
    opacity: ${props => props.$isOpen ? '1' : '0'};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    margin-left: ${props => props.$isOpen ? '10px' : '0px'}; 

    @media (max-width: 768px) {
        width: 100%;
        opacity: 1;
        visibility: visible;
        margin-left: 0;
    }
`;

const SearchInput = styled.input<{ $isOpen: boolean }>`
    width: 100%;
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background-color: var(--card-bg);
    color: var(--text-primary);
    font-size: 14px;
    outline: none;
    
    &:focus {
        border-color: var(--primary);
        background-color: var(--card-hover);
    }

    &::placeholder {
        color: var(--text-secondary);
    }
`;

const SearchIconBtn = styled.button`
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;

    &:hover {
        background: rgba(128, 128, 128, 0.1);
    }
    
    @media (max-width: 768px) {
        display: none; 
    }
`;

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
    flex-wrap: wrap;
    gap: 10px;
    
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
    border: 1px solid ${props => props.$active ? 'var(--primary)' : 'var(--border)'};
    background-color: ${props => props.$active ? 'var(--primary)' : 'transparent'};
    color: ${props => props.$active ? '#fff' : 'var(--text-secondary)'};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    
    &:hover {
        border-color: var(--primary);
        color: ${props => props.$active ? '#fff' : 'var(--text-primary)'};
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
        grid-template-columns: repeat(4, 1fr);
    }
`;

const Loading = styled.div`
    text-align: center;
    padding: 20px;
    color: var(--text-primary);
    font-size: 14px;
`;

const EndOfList = styled.div`
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
    font-size: 14px;
`;

import { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { getOverallTop10, getCategoryTop10 } from '@/app/actions';
import TotalCard from './TotalCard';
import SkeletonCard from './SkeletonCard';
import { getPriceInfo } from '@/utils/format';

interface RecommendationContainerProps {
    preferences: {
        category: string;
        priority: string;
    };
    isLoading: boolean;
}

export default function RecommendationContainer({ preferences, isLoading }: RecommendationContainerProps) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch data based on category (optimization)
                let rawItems = [];
                if (preferences.category && preferences.category !== 'all') {
                    // Map frontend category values to backend expected values if needed
                    // 'digital', 'food', 'living', 'fashion'
                    // Backend might expect capitalized or specific strings. 
                    // getCategoryTop10 takes a string. 
                    // Let's assume the values map directly or we need a mapper.
                    // Based on CategoryContainer, it passes 'Food', 'Drink' etc.
                    // Let's map 'digital' -> 'Office' (closest?), 'food' -> 'Food', 'living' -> 'Toiletries'?
                    // Actually, let's just fetch ALL top 10 from categories or getOverallTop10 if specific fetch fails/is complex.
                    // Better strategy: Fetch getOverallTop10 AND getCategoryTop10 for the specific category to ensure we have enough data.

                    // Mapping based on previous code:
                    const categoryMap: { [key: string]: string } = {
                        'digital': 'Office', // Assumption based on "Digital/Office" label
                        'food': 'Food',
                        'living': 'Toiletries', // Assumption: Living ~ Toiletries/Others
                        'fashion': 'Others'
                    };

                    const targetCategory = categoryMap[preferences.category] || 'Others';
                    // Strict filtering: ONLY fetch category items
                    rawItems = await getCategoryTop10(targetCategory);
                } else {
                    rawItems = await getOverallTop10();
                }

                // 1. Filter by Category (Software filtering ensures strictness)
                // If the user selected a category, we strictly emphasize it, 
                // but maybe allow some general hotdeals if they match the vibe? 
                // Strict filtering is safer for "Recommendation".
                // However, "digital" mapping to "Office" might be too narrow. 
                // Let's filter loosely or just rely on the sort.
                // Let's just use the fetched items and sort them heavily.

                let processedItems = rawItems.map(item => {
                    const { price: displayPrice, originalPrice } = getPriceInfo(item.price, item.title);
                    // Calculate discount rate if not present
                    let discountRate = 0;
                    if (originalPrice && displayPrice < originalPrice) {
                        discountRate = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
                    }
                    return { ...item, discountRate, displayPrice };
                });

                // 2. Sort by Priority
                if (preferences.priority === 'discount') {
                    processedItems.sort((a, b) => b.discountRate - a.discountRate);
                } else if (preferences.priority === 'rating') {
                    // Rating = star rating (if available) or votes
                    processedItems.sort((a, b) => (b.votes || 0) - (a.votes || 0));
                } else if (preferences.priority === 'reaction') {
                    // Reaction = comment_count + votes
                    processedItems.sort((a, b) => ((b.comment_count || 0) + (b.votes || 0)) - ((a.comment_count || 0) + (a.votes || 0)));
                }

                // Apply custom sorting (2-1-3) for display if we have enough items
                // We don't change the underlying array sort, just how we slice/display?
                // Actually, let's keep the sorted list as is for "others" but rearrange the top 3 visually.
                // Wait, if we change the array order here, "others" slice might be weird.
                // It's safer to reorder just the top 3 AFTER slicing.

                setItems(processedItems);

                // Auto-scroll to top
                if (containerRef.current) {
                    containerRef.current.scrollIntoView({ behavior: 'smooth' });
                }

            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [preferences, isLoading]);

    if (isLoading || loading) {
        return (
            <Container>
                <Header>
                    <Title>✨ AI 맞춤 추천 결과</Title>
                    <Subtitle>당신의 취향을 분석하여 최적의 상품을 찾고 있습니다...</Subtitle>
                </Header>
                <Grid>
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </Grid>
            </Container>
        );
    }

    const top3 = items.slice(0, 3);
    const others = items.slice(3);

    // Reorder Top 3: [2nd, 1st, 3rd] -> indices [1, 0, 2]
    // If < 3 items, we just show what we have. 
    // If 2 items: [2nd, 1st] -> indices [1, 0] ?? No, user said "if < 3, 1-2 order". 
    // "아이템이 만약 3개 미만이라면 1 2 순으로 변경" -> This means standard order [0, 1].
    // So ONLY if >= 3, we do [1, 0, 2].

    let reorderedTop3 = top3;
    if (top3.length >= 3) {
        reorderedTop3 = [top3[1], top3[0], top3[2]];
    }
    // Note: The visual rank badge needs to reflect the ORIGINAL rank, not the new position.
    // top3[0] is Rank 1. top3[1] is Rank 2.
    // In reordered array:
    // index 0 is Rank 2
    // index 1 is Rank 1
    // index 2 is Rank 3

    return (
        <Container ref={containerRef}>
            <Header>
                <Title>✨ AI 맞춤 추천 결과</Title>
                <Subtitle>
                    <strong>{preferences.category === 'digital' ? '디지털/오피스' :
                        preferences.category === 'food' ? '식품/음료' :
                            preferences.category === 'living' ? '생활용품' : '패션/뷰티'}</strong> 카테고리에서
                    <strong> {preferences.priority === 'discount' ? '압도적인 가격 할인' :
                        preferences.priority === 'rating' ? '높은 사용자 평점' : '많은 사용자 호응'}</strong>
                    순으로 엄선했습니다.
                </Subtitle>
            </Header>

            <BestSection>
                {reorderedTop3.map((item, index) => {
                    // Determine original rank based on logic
                    // If >= 3:
                    // index 0 -> was top3[1] -> Rank 2
                    // index 1 -> was top3[0] -> Rank 1
                    // index 2 -> was top3[2] -> Rank 3

                    // IF < 3:
                    // index 0 -> Rank 1
                    // index 1 -> Rank 2

                    let rank = index + 1;
                    if (top3.length >= 3) {
                        if (index === 0) rank = 2;
                        else if (index === 1) rank = 1;
                        else if (index === 2) rank = 3;
                    }

                    return (
                        <BestCardWrapper key={item.id} $rank={rank}>
                            <RankBadge $rank={rank}>{rank}위</RankBadge>
                            <TotalCard item={item} />
                        </BestCardWrapper>
                    );
                })}
            </BestSection>

            <Divider />

            <OtherTitle>이런 상품은 어때요?</OtherTitle>
            <Grid>
                {others.map((item, index) => (
                    <TotalCard key={item.id} item={item} />
                ))}
            </Grid>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px; // increased gap
  width: 100%;
  animation: fadeIn 0.8s ease-out;
  padding-bottom: 60px;
  
  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;

const Title = styled.h2`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
    background: linear-gradient(90deg, var(--text-primary), var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.6;
    
    strong {
        color: var(--primary);
        font-weight: 600;
    }
`;

const BestSection = styled.div`
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

const BestCardWrapper = styled.div<{ $rank: number }>`
    position: relative;
    width: 100%;
    max-width: 380px;
    transform: ${props => props.$rank === 1 ? 'scale(1.05)' : 'scale(1)'};
    z-index: ${props => props.$rank === 1 ? '2' : '1'};
    transition: transform 0.3s;
    
    &:hover {
        transform: ${props => props.$rank === 1 ? 'scale(1.08)' : 'scale(1.03)'};
    }
    
    @media (max-width: 1024px) {
        transform: scale(1);
        max-width: 100%;
    }
`;

const RankBadge = styled.div<{ $rank: number }>`
    position: absolute;
    top: -15px;
    left: 20px;
    background: ${props => props.$rank === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
        props.$rank === 2 ? 'linear-gradient(135deg, #C0C0C0, #A9A9A9)' :
            'linear-gradient(135deg, #CD7F32, #8B4513)'};
    color: #fff;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 800;
    font-size: 14px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    z-index: 10;
    border: 2px solid rgba(255,255,255,0.2);
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 20px 0;
`;

const OtherTitle = styled.h3`
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 20px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    width: 100%;
    
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

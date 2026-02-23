import { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { getOverallTop10, getCategoryTop10 } from '@/app/actions';
import TotalCard from './TotalCard';
import SkeletonCard from './SkeletonCard';
import { getPriceInfo } from '@/utils/format';
import AIPipelineModal from './AIPipelineModal';

interface RecommendationContainerProps {
    result: {
        data: any[];
        aiData: {
            target_categories: string[];
            search_keywords: string[];
            related_keywords?: string[];
            ai_comment: string;
        }
    } | null;
}

export default function RecommendationContainer({ result }: RecommendationContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (result && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [result]);

    if (!result) {
        return (
            <Container>
                <Header>
                    <TitleWrapper>
                        <Title>✨ AI 맞춤 추천 결과</Title>
                        <TooltipIcon onClick={() => setIsModalOpen(true)} aria-label="추천 방식 보기">❔</TooltipIcon>
                    </TitleWrapper>
                    <Subtitle>당신의 취향을 분석하여 최적의 상품을 찾고 있습니다...</Subtitle>
                </Header>
                <Grid>
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </Grid>
            </Container>
        );
    }

    const { data: items, aiData } = result;

    // Apply format for price/discount display
    const processedItems = items.map(item => {
        const { price: displayPrice, originalPrice } = getPriceInfo(item.price, item.title);
        let discountRate = 0;
        if (originalPrice && displayPrice < originalPrice) {
            discountRate = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
        }
        return { ...item, discountRate, displayPrice };
    });

    const top3 = processedItems.slice(0, 3);
    const others = processedItems.slice(3);

    if (processedItems.length === 0) {
        return (
            <Container ref={containerRef}>
                <Header>
                    <TitleWrapper>
                        <Title>✨ AI 맞춤 추천 결과</Title>
                        <TooltipIcon onClick={() => setIsModalOpen(true)} aria-label="추천 방식 보기">❔</TooltipIcon>
                    </TitleWrapper>
                    <AICommentBox>
                        <Subtitle>🤖 <strong>{aiData.ai_comment}</strong></Subtitle>
                        <KeywordsContainer>
                            {[...(aiData.search_keywords || []), ...(aiData.related_keywords || [])].map((kw, idx) => (
                                <KeywordBadge key={`${kw}-${idx}`}>#{kw}</KeywordBadge>
                            ))}
                        </KeywordsContainer>
                        <DisclaimerText>
                            ※ AI 기반의 추천이므로 실제 찾으시는 조건과 100% 일치하지 않을 수 있습니다.
                        </DisclaimerText>
                    </AICommentBox>
                </Header>
                <EmptyState>
                    <EmptyIcon>🔍</EmptyIcon>
                    <EmptyTitle>아쉽게도 딱 맞는 핫딜을 찾지 못했어요</EmptyTitle>
                    <EmptyDesc>
                        핫딜 특성상 찾으시는 상품의 할인이 종료되었거나 현재 재고가 없을 수 있습니다. <br />
                        조금 더 포괄적인 단어나 다른 비슷한 상품명으로 지침을 주시면 다시 한번 열심히 찾아볼게요!
                    </EmptyDesc>
                </EmptyState>
            </Container>
        );
    }

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
                <TitleWrapper>
                    <Title>✨ AI 맞춤 추천 결과</Title>
                    <TooltipIcon onClick={() => setIsModalOpen(true)} aria-label="추천 방식 보기">❔</TooltipIcon>
                </TitleWrapper>
                <AICommentBox>
                    <Subtitle>🤖 <strong>{aiData.ai_comment}</strong></Subtitle>
                    <KeywordsContainer>
                        {[...(aiData.search_keywords || []), ...(aiData.related_keywords || [])].map((kw, idx) => (
                            <KeywordBadge key={`${kw}-${idx}`}>#{kw}</KeywordBadge>
                        ))}
                    </KeywordsContainer>
                    <DisclaimerText>
                        ※ AI 기반의 추천이므로 실제 찾으시는 조건과 100% 일치하지 않을 수 있습니다.
                    </DisclaimerText>
                </AICommentBox>
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

            <AIPipelineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 16px;
`;

const Title = styled.h2`
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(90deg, var(--text-primary), var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const TooltipIcon = styled.button`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: rgba(0, 200, 83, 0.1);
        border-color: var(--primary);
        color: var(--primary);
        transform: scale(1.1);
        box-shadow: 0 0 10px rgba(0, 200, 83, 0.3);
    }
`;

const Subtitle = styled.p`
    font-size: 18px;
    color: var(--text-primary);
    line-height: 1.6;
    margin-bottom: 12px;
    
    strong {
        color: var(--primary);
        font-weight: 700;
    }
`;

const AICommentBox = styled.div`
    background: rgba(0, 200, 83, 0.05);
    border: 1px solid rgba(0, 200, 83, 0.2);
    border-radius: 20px;
    padding: 24px;
    margin: 0 auto;
    max-width: 800px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
`;

const KeywordsContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
`;

const KeywordBadge = styled.span`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-secondary);
    font-size: 13px;
    padding: 4px 12px;
    border-radius: 12px;
`;

const DisclaimerText = styled.div`
    margin-top: 16px;
    font-size: 13px;
    color: var(--text-secondary);
    opacity: 0.8;
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

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    text-align: center;
    margin-top: 20px;
`;

const EmptyIcon = styled.div`
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.8;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
`;

const EmptyTitle = styled.h3`
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
`;

const EmptyDesc = styled.p`
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.5;
    max-width: 400px;
`;

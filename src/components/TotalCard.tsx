'use client';

import styled from 'styled-components';

interface TotalCardProps {
    item: any;
}

export default function TotalCard({ item }: TotalCardProps) {
    const getPlatformIcon = (link: string) => {
        if (!link) return null;
        if (link.includes('naver')) return '/icons/naver.png';
        if (link.includes('auction')) return '/icons/auction.png';
        if (link.includes('11st')) return '/icons/11st.png';
        if (link.includes('coupang')) return '/icons/coupang.png';
        if (link.includes('gmarket')) return '/icons/gmarket.png';
        if (link.includes('lotte')) return '/icons/lotte.png';
        if (link.includes('toss')) return '/icons/toss.png';
        if (link.includes('ohou')) return '/icons/ohouse.png';
        return null;
    };

    const iconSrc = getPlatformIcon(item.link || item.url);

    return (
        <Item
            href={item.link || item.url}
            target="_blank"
            rel="noopener noreferrer"
        >
            <PlatformIconWrapper>
                {iconSrc && <PlatformIcon src={iconSrc} alt="store image" />}
            </PlatformIconWrapper>
            <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemPrice>
                    <p>{item.discount_price ? `${parseInt(item.discount_price).toLocaleString()}원` : '가격 정보 없음'}</p>
                    <SavingsText>
                        정가 대비 {item.savings ? `${parseInt(item.savings).toLocaleString()}원 ↓` : '가격 정보 없음'}
                    </SavingsText>
                </ItemPrice>
                <ItemInfo>
                    <p>추천수 {item.votes}</p>
                    <p>댓글수 {item.comment_count}</p>
                </ItemInfo>
            </ItemContent>
            <AIContent>
                <AIContentTitle>AI 분석 🦾</AIContentTitle>
                <AIContentBody>
                    <p>• 점수 : {item.score}점/10점</p>
                    <p>• 추천 : {item.ai_summary}</p>
                </AIContentBody>
            </AIContent>
        </Item>
    );
}

const Item = styled.a`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
    min-height: 400px;
    border-radius: 12px;
    background-color: var(--background);
    align-items: center;
    border: 1px solid #2e2e2e;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
`;

const PlatformIconWrapper = styled.div`
    width: 100%;
    height: 150px;
    min-height: 200px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-color: #fff;
    position: relative;
`;

const PlatformIcon = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const ItemContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    padding: 10px;
`;

const ItemTitle = styled.div`
    font-size: 16px;
    line-height: 1.4;
    font-weight: 700;
    color: #fff;
    height: 42px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const ItemPrice = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-size: 26px;
    font-weight: 700;
    color: #e53935;
`;

const ItemInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
   
    p {
        font-size: 12px;
        font-weight: 500;
        color: #fff;
        border-radius: 4px;
        padding: 4px 8px;
        background: #006239;
    }   
`;

const SavingsText = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    opacity: 0.8;
`;

const AIContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 10px;
`;

const AIContentTitle = styled.div`
    font-size: 13px;
    font-weight: 700;
    color: #fff;
`;

const AIContentBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 6px;
    font-size: 12.4px;
    line-height: 1.4;
    font-weight: 500;
    color: #fff;
`;

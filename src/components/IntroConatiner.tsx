'use client';

import { useEffect, useState } from 'react';
import { getCrawlStats } from '@/app/actions';
import styled from 'styled-components';


interface IntroContainerProps {
  onAIComplete?: () => void;
}

export default function IntroContainer({ onAIComplete }: IntroContainerProps) {

  const [crawlStats, setCrawlStats] = useState<any[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  useEffect(() => {
    const fetchCrawlStats = async () => {
      try {
        const data = await getCrawlStats();
        setCrawlStats(data || []);
      } catch (e) {
        console.error("Error fetching crawl stats:", e);
      }
    };

    fetchCrawlStats();
  }, []);

  const stats = crawlStats[0] || {};
  const totalItems = stats.total_items || 0;
  const hotdealItems = stats.hotdeal_items || 0;

  return (
    <Container>
      <ContentsWrapper>
        <Title>소개</Title>
        <Description>
          매일 두 번 주요 커뮤니티의 핫딜을 수집하여 광고와 스팸을 제거하고, <strong>네이버 최저가 검증</strong>과 <strong>Gemini 2.5 AI의 심층 분석</strong>을 통해 가성비가 좋은 <strong>핫딜</strong>만을 엄선합니다.
        </Description>

        <SubDescription>
          <span>• 핫딜이란?</span>
          <br />1. 저렴한 가격에 상품을 구매할 수 있는 특별한 기회를 의미합니다.
          <br />2. 특정 기간에 한정하여 파격적인 할인을 제공하고, 온라인 커뮤니티에서 가성비 좋은 상품 정보를 공유할 때 자주 사용됩니다.
          <br />3. 핫딜 특성상 실시간으로 가격이 변동성이 크기 때문에, 제공된 가격과 상이할 수 있습니다.
        </SubDescription>


        <DetailToggle onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
          {isDetailsOpen ? '▲ 데이터 처리 기준 접기' : '▼ 데이터 처리 기준 상세보기'}
        </DetailToggle>

        <DetailContent $isOpen={isDetailsOpen}>
          <DetailSection>
            <h4>1. 하드 필터 (Hard Filter) - 비용 절감</h4>
            <p>AI 분석 전에 명백한 광고나 가치 없는 정보를 즉시 제거하여 API 비용을 아낍니다.</p>
            <ul>
              <li><Red>삭제</Red> 광고, 제휴, 체험단 키워드가 포함된 글</li>
              <li><Red>삭제</Red> 이미 종료되었거나 품절된 딜 ("종료", "품절")</li>
              <li><Red>삭제</Red> 사용자 반응이 너무 저조한 글 (댓글 3개 미만)</li>
            </ul>
          </DetailSection>
          <DetailSection>
            <h4>2. 소프트 스코어링 (Soft Scoring) - 가치 평가</h4>
            <p>단순 필터링을 넘어, 데이터에 가산점을 부여하여 우선순위를 정합니다.</p>
            <ul>
              <li><Green>가산점</Green> 네이버 최저가보다 15% 이상 저렴한 경우</li>
              <li><Green>가산점</Green> 게시 직후 반응 속도(댓글/추천 증가율)가 빠른 경우</li>
              <li><Green>가산점</Green> 생필품 관련 키워드(식품, 휴지 등) 포함 시</li>
            </ul>
          </DetailSection>
          <DetailSection>
            <h4>3. AI 심층 분석 (Gemini 2.5) - 최종 확정</h4>
            <p>소프트 스코어링 기반으로 남은 데이터들을 LLM이 직접 읽고 판단합니다.</p>
            <ul>
              <li><Blue>분석</Blue> 댓글의 뉘앙스 파악 ("쟁여둔다", "역대가" 등 긍정 감성)</li>
              <li><Blue>분석</Blue> 기업 비품으로서의 적합성 여부 판단</li>
              <li><Blue>판정</Blue> 최종적으로 <strong>HOT / DROP</strong> 상태 판정</li>
            </ul>
          </DetailSection>
        </DetailContent>

        <StatsGrid>
          <StatCard>
            <Label>수집된 사이트</Label>
            <Value>{stats.community_count}<Unit>개</Unit></Value>
          </StatCard>
          <StatCard>
            <Label>수집된 총 핫딜</Label>
            <Value>{totalItems.toLocaleString()}<Unit>건</Unit></Value>
          </StatCard>
          <StatCard>
            <Label>AI 엄선 핫딜</Label>
            <Value $highlight>{hotdealItems.toLocaleString()}<Unit>건</Unit></Value>
          </StatCard>
        </StatsGrid>

        <PipelineContainer>
          <PipelineHeader>
            <PipelineTitle>3단계 AI 필터링 파이프라인</PipelineTitle>
            <PipelineInsight>
              오늘 AI가 <span>{totalItems - hotdealItems}건</span>의 부적합 정보를 걸러냈습니다.
            </PipelineInsight>
          </PipelineHeader>

          <PipelineVisual>
            <PipelineStep>
              <StepLabel>데이터 수집 후</StepLabel>
              <StepBar $width={100} $color="#444" />
              <StepValue>{totalItems}</StepValue>
            </PipelineStep>

            <PipelineArrow>▶</PipelineArrow>

            <PipelineStep>
              <StepLabel>1-3차 필터링 후</StepLabel>
              <StepBar $width={60} $color="#666" />
              <StepValue>{stats.filtered_items}</StepValue>
            </PipelineStep>

            <PipelineArrow>▶</PipelineArrow>

            <PipelineStep>
              <StepLabel>AI 확정 후</StepLabel>
              <StepBar $width={30} $color="#00c853" />
              <StepValue>{hotdealItems}</StepValue>
            </PipelineStep>
          </PipelineVisual>
        </PipelineContainer>
      </ContentsWrapper>
    </Container>
  );
}

const PipelineContainer = styled.div`
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const PipelineHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px solid #333;
    padding-bottom: 15px;
    
    @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
`;

const PipelineTitle = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
`;

const PipelineInsight = styled.div`
    font-size: 14px;
    color: var(--text-secondary);
    
    span {
        color: var(--primary);
        font-weight: 700;
        font-size: 16px;
    }
`;

const PipelineVisual = styled.div`
    display: flex;
    flex-direction: row; 
    align-items: center;
    justify-content: space-around;
    padding: 10px 0;
    
    @media (max-width: 640px) {
        flex-direction: column;
        gap: 10px;
    }
`;

const PipelineStep = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 80px;
`;

const StepLabel = styled.div`
    font-size: 12px;
    color: #888;
`;

const StepBar = styled.div<{ $width: number; $color: string }>`
    width: 60px;
    height: ${props => props.$width}px; 
    background-color: ${props => props.$color};
    border-radius: 4px;
    transition: all 0.5s;
    min-height: 4px;
    
    @media (max-width: 640px) {
         width: ${props => props.$width}%;
         height: 12px;
    }
`;

const StepValue = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
`;

const PipelineArrow = styled.div`
    color: #444;
    font-size: 12px;
    
    @media (ma-width: 641px) {
        transform: rotate(-90deg); 
    }
`;

const Description = styled.p`
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.6;
    word-break: keep-all;
    
    strong {
        color: var(--primary);
        font-weight: 600;
    }
`;

const SubDescription = styled.p`
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-top: 12px;
    margin-bottom: 20px;
    word-break: keep-all;
    
    @media (max-width: 640px) {
        font-size: 12.5px;
        line-height: 1.8;
    }
    
    strong {
        color: var(--primary);
        font-weight: 600;
    }

    span {
        display: inline-block;
        font-weight: 700;
        margin-bottom: 4px;
        
        @media (max-width: 640px) {
            font-size: 13px;
        }
    }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const ContentsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 18px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
    margin-bottom: 20px;

    @media (max-width: 640px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;

const StatCard = styled.div`
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
`;

const Label = styled.div`
    font-size: 14px;
    color: #aaa;
    font-weight: 500;
`;

const Value = styled.div<{ $highlight?: boolean }>`
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.$highlight ? 'var(--primary)' : 'var(--text-primary)'};
    display: flex;
    align-items: baseline;
    gap: 2px;
`;

const Unit = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #888;
`;

const DetailToggle = styled.button`
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    padding: 10px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.3s;
    
    &:hover {
        color: var(--text-primary);
    }
`;

const DetailContent = styled.div<{ $isOpen: boolean }>`
    background-color: var(--card-bg);
    border: ${props => props.$isOpen ? '1px solid var(--border)' : 'none'};
    border-radius: 12px;
    max-height: ${props => props.$isOpen ? '1000px' : '0'};
    opacity: ${props => props.$isOpen ? '1' : '0'};
    padding: ${props => props.$isOpen ? '20px' : '0 20px'};
    margin-bottom: ${props => props.$isOpen ? '20px' : '0'};
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

const DetailSection = styled.div`
    h4 {
        color: var(--text-primary);
        font-size: 15px;
        margin-bottom: 8px;
        font-weight: 700;
    }
    p {
        color: var(--text-secondary);
        font-size: 13px;
        margin-bottom: 10px;
    }
    ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    li {
        font-size: 13px;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;

const Badge = styled.span`
    font-size: 11px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
`;

const Red = styled(Badge)`
    background-color: rgba(255, 82, 82, 0.1);
    color: #ff5252;
    border: 1px solid rgba(255, 82, 82, 0.3);
`;

const Green = styled(Badge)`
    background-color: rgba(0, 200, 83, 0.1);
    color: #00c853;
    border: 1px solid rgba(0, 200, 83, 0.3);
    min-width: 43px;
`;

const Blue = styled(Badge)`
    background-color: rgba(68, 138, 255, 0.1);
    color: #448aff;
    border: 1px solid rgba(68, 138, 255, 0.3);
    min-width: 34px;
`;

const RecommendButton = styled.button`
    width: 100%;
    background: linear-gradient(90deg, #1e1e1e 0%, #2a2a2a 100%);
    border: 1px solid #00c853;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    margin: 10px 0 20px 0;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.1);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 200, 83, 0.2);
        background: linear-gradient(90deg, #252525 0%, #333 100%);
    }
`;

const ButtonIcon = styled.div`
    font-size: 24px;
`;

const ButtonText = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    gap: 4px;
`;

const ButtonTitle = styled.div`
    color: #00c853;
    font-size: 16px;
    font-weight: 700;
`;

const ButtonSub = styled.div`
    color: #aaa;
    font-size: 13px;
`;

const ButtonArrow = styled.div`
    color: #00c853;
    font-size: 18px;
    font-weight: 700;
`;
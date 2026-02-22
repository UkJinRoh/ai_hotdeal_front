'use client';

import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import IntroContainer from './IntroConatiner';
import CategoryContainer from './CategoryContainer';
import AllContainer from './AllContainer';
import TotalContainer from './TotalContainer';
import RecommendationPopup from './RecommendationPopup';

import RecommendationContainer from './RecommendationContainer';

export default function Dashboard() {
  const [isAIAnalysisLoading, setIsAIAnalysisLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRecommendationsActive, setIsRecommendationsActive] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<any>(null);

  const handleRecommendationComplete = (result: any) => {
    console.log("AI Recommendation Result:", result);
    setRecommendationResult(result);
    setIsRecommendationsActive(true);
  };

  const handleReset = () => {
    setIsRecommendationsActive(false);
    setRecommendationResult(null);
  };

  return (
    <Container>
      <IntroContainer />

      {isRecommendationsActive ? (
        <RecommendationContainer
          result={recommendationResult}
        />
      ) : (
        <>
          <AllContainer isLoading={isAIAnalysisLoading} />
          <CategoryContainer
            categories={['Office', 'Food', 'Drink', 'Toiletries', 'Others']}
            isLoading={isAIAnalysisLoading}
          />
          <TotalContainer isLoading={isAIAnalysisLoading} />
        </>
      )}

      <RecommendationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onComplete={handleRecommendationComplete}
      />

      <FixedControls>
        {isRecommendationsActive && (
          <ResetButton onClick={handleReset} aria-label="맞춤 추천 해제">
            ✕ 추천 해제
          </ResetButton>
        )}
        <FloatingButton onClick={() => setIsPopupOpen(true)} aria-label="AI 맞춤 추천 받기">
          <ButtonIcon>✨</ButtonIcon>
          <ButtonLabel>AI 맞춤 추천</ButtonLabel>
        </FloatingButton>
      </FixedControls>
    </Container>
  );
}

const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(0, 200, 83, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(0, 200, 83, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 200, 83, 0); }
`;

const FixedControls = styled.div`
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    z-index: 1000;
`;

const ResetButton = styled.button`
    background: rgba(30, 30, 30, 0.9);
    backdrop-filter: blur(4px);
    border: 1px solid #444;
    color: #ccc;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);

    &:hover {
        background: rgba(50, 50, 50, 0.9);
        color: #fff;
        border-color: #666;
    }
`;

const FloatingButton = styled.button`
    background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
    border: 1px solid #00c853;
    color: #fff;
    padding: 12px 20px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: ${pulse} 2s infinite;

    &:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 200, 83, 0.4);
        background: linear-gradient(135deg, #252525 0%, #333 100%);
    }

    &:active {
        transform: translateY(0) scale(0.95);
    }
`;

const ButtonIcon = styled.span`
    font-size: 18px;
`;

const ButtonLabel = styled.span`
    white-space: nowrap;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  margin: 20px 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

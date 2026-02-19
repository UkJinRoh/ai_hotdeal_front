'use client';

import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

interface RecommendationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (preferences: any) => void;
}

export default function RecommendationPopup({ isOpen, onClose, onComplete }: RecommendationPopupProps) {
    const [step, setStep] = useState(0);
    const [preferences, setPreferences] = useState<{ [key: string]: string }>({
        purpose: '',
        category: '',
        priority: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    if (!isOpen) return null;

    const handleSelect = (key: string, value: string) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        setTimeout(() => {
            if (step < questions.length - 1) {
                setStep(prev => prev + 1);
            } else {
                finishSurvey();
            }
        }, 250);
    };

    const finishSurvey = () => {
        setIsAnalyzing(true);
        const processingLogs = [
            "Connecting to Gemini 2.5 AI...",
            "Analyzing hotdeal items...",
            "Filtering by verified sellers...",
            `Optimizing for '${preferences.priority || 'Best Match'}'...`,
            "Calculating cost-efficiency score...",
            "Finalizing recommendation list..."
        ];

        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < processingLogs.length) {
                setLogs(prev => [...prev, processingLogs[logIndex]]);
                logIndex++;
            }
        }, 600);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    clearInterval(logInterval);
                    setTimeout(() => {
                        onComplete(preferences);
                        onClose();
                        // Reset state
                        setTimeout(() => {
                            setIsAnalyzing(false);
                            setStep(0);
                            setLogs([]);
                            setProgress(0);
                        }, 500);
                    }, 800);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    const questions = [
        {
            key: 'category',
            question: '어떤 상품을 찾고 계신가요?',
            options: [
                { label: '디지털/오피스', value: 'digital', icon: '💻' },
                { label: '식품/음료', value: 'food', icon: '🍔' },
                { label: '생활용품', value: 'living', icon: '🧻' },
                { label: '패션/뷰티', value: 'fashion', icon: '👕' }
            ]
        },
        {
            key: 'priority',
            question: '가장 중요하게 생각하는 요소는?',
            options: [
                { label: '압도적인 가격 할인', value: 'discount', icon: '💸' },
                { label: '높은 사용자 평점', value: 'rating', icon: '⭐' },
                { label: '많은 사용자 호응', value: 'reaction', icon: '🔥' }
            ]
        }
    ];

    return (
        <Overlay>
            <PopupContainer>
                <CloseButton onClick={onClose}>×</CloseButton>

                {isAnalyzing ? (
                    <AnalyzingView>
                        <PulseContainer>
                            <PulseCircle $delay={0} />
                            <PulseCircle $delay={1} />
                            <PulseCircle $delay={2} />
                            <Core />
                        </PulseContainer>
                        <StatusMessage>
                            <StatusTitle>AI Analyzing...</StatusTitle>
                            <StatusSub>{logs[logs.length - 1] || "Connecting..."}</StatusSub>
                        </StatusMessage>
                        <ProgressBarContainer>
                            <ProcessingBar $width={progress} />
                        </ProgressBarContainer>
                    </AnalyzingView>
                ) : (
                    <>
                        <ProgressBar>
                            <Progress $width={((step + 1) / questions.length) * 100} />
                        </ProgressBar>
                        <HeaderSection>
                            <StepIndicator>Step {step + 1}/{questions.length}</StepIndicator>
                            <Question>{questions[step].question}</Question>
                        </HeaderSection>

                        <OptionsGrid>
                            {questions[step].options.map((option) => (
                                <OptionButton
                                    key={option.value}
                                    onClick={() => handleSelect(questions[step].key, option.value)}
                                    $selected={preferences[questions[step].key] === option.value}
                                >
                                    <OptionContent>
                                        <OptionIcon>{option.icon}</OptionIcon>
                                        <OptionLabel>{option.label}</OptionLabel>
                                    </OptionContent>
                                    <ArrowIcon>→</ArrowIcon>
                                </OptionButton>
                            ))}
                        </OptionsGrid>
                    </>
                )}
            </PopupContainer>
        </Overlay>
    );
}

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
    0% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(2); opacity: 0; }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const PopupContainer = styled.div`
    background: rgba(30, 30, 30, 0.8);
    width: 90%;
    max-width: 420px;
    padding: 40px;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.05);
    position: relative;
    animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    min-height: 450px;
    display: flex;
    flex-direction: column;
    color: #fff;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255,255,255,0.1);
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover { 
        background: rgba(255,255,255,0.2);
        transform: rotate(90deg);
    }
`;

const ProgressBar = styled.div`
    width: 95%;
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    margin-bottom: 30px;
    overflow: hidden;
`;

const Progress = styled.div<{ $width: number }>`
    width: ${props => props.$width}%;
    height: 100%;
    background: linear-gradient(90deg, #448aff, #00c853);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px rgba(68,138,255,0.5);
`;

const HeaderSection = styled.div`
    margin-bottom: 30px;
`;

const StepIndicator = styled.div`
    color: #448aff;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
`;

const Question = styled.h2`
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
    margin: 0;
    background: linear-gradient(to right, #fff, #aaa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const OptionsGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const OptionButton = styled.button<{ $selected?: boolean }>`
    background: ${props => props.$selected ? 'rgba(68, 138, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
    border: 1px solid ${props => props.$selected ? '#448aff' : 'rgba(255, 255, 255, 0.1)'};
    padding: 18px 20px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
`;

const OptionContent = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const OptionIcon = styled.span`
    font-size: 22px;
`;

const OptionLabel = styled.span`
    color: #fff;
    font-size: 16px;
    font-weight: 500;
`;

const ArrowIcon = styled.span`
    color: rgba(255,255,255,0.3);
    font-size: 18px;
    transition: transform 0.2s;
    
    ${OptionButton}:hover & {
        transform: translateX(4px);
        color: #fff;
    }
`;

// Analyzing View Styles
const AnalyzingView = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 300px;
`;

const PulseContainer = styled.div`
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
`;

const Core = styled.div`
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 0 20px rgba(255,255,255,0.8);
`;

const PulseCircle = styled.div<{ $delay: number }>`
    position: absolute;
    width: 60px;
    height: 60px;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    animation: ${pulse} 2s infinite ease-out;
    animation-delay: ${props => props.$delay * 0.6}s;
`;

const StatusMessage = styled.div`
    text-align: center;
    margin-bottom: 30px;
`;

const StatusTitle = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    background: linear-gradient(90deg, #448aff, #00c853);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const StatusSub = styled.div`
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    font-family: 'SF Mono', 'Menlo', monospace;
    min-height: 20px;
`;

const ProgressBarContainer = styled.div`
    width: 60%;
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
`;

const ProcessingBar = styled.div<{ $width: number }>`
    width: ${props => props.$width}%;
    height: 100%;
    background: linear-gradient(90deg, #448aff, #00c853);
    transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(68,138,255,0.5);
`;

'use client';

import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
    const [currentLog, setCurrentLog] = useState<string>('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setIsAnalyzing(false);
                setStep(0);
                setCurrentLog('');
                setProgress(0);
                setPreferences({ purpose: '', category: '', priority: '' });
            }, 500);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelect = (key: string, value: string) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        setTimeout(() => {
            if (step < questions.length - 1) {
                setStep(prev => prev + 1);
            } else {
                finishSurvey();
            }
        }, 300);
    };

    const finishSurvey = () => {
        setIsAnalyzing(true);
        const categoryMap: Record<string, string> = {
            Office: '사무용품관',
            Food: '식품관',
            Drink: '음료 코너',
            Toiletries: '생활용품 창고',
            Others: '기타 매장'
        };

        const targetCorner = categoryMap[preferences.category] || '창고 전체';

        // Add fun waiting text
        const martLogs = [
            "고객님이 찾으시는 맞춤 상품을 탐색합니다! 🏃‍♂️💨",
            `${targetCorner}로 달려가서 매대를 확인하는 중... 💦`,
            "진짜 할인이 맞는지 가격표를 꼼꼼히 비교하고 있어요 🧐",
            `'${preferences.priority === 'discount' ? '초특가' : preferences.priority === 'rating' ? '평점 만점' : '인기 폭발'}' 상품들 위주로 장바구니에 챙기는 중 🛒`,
            "가짜 할인, 광고 상품은 전부 바깥으로 던져버립니다! 🗑️",
            "야호! 완벽한 상품들을 찾았어요. 곧 보여드릴게요 🎁"
        ];

        let logIndex = 0;
        setCurrentLog(martLogs[0]);

        const logInterval = setInterval(() => {
            logIndex++;
            if (logIndex < martLogs.length) {
                setCurrentLog(martLogs[logIndex]);
            }
        }, 800);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    clearInterval(logInterval);
                    setTimeout(() => {
                        onComplete(preferences);
                        onClose();
                    }, 1500); // 100% 보여주고 조금 대기
                    return 100;
                }
                // 부드럽지만 불규칙하게 차오름
                const increment = Math.random() * 8 + 3;
                return Math.min(prev + increment, 100);
            });
        }, 200);
    };

    const questions = [
        {
            key: 'category',
            question: '어떤 분류가 필요하신가요?',
            options: [
                { label: '사무용품', value: 'Office', icon: '💻' },
                { label: '식품', value: 'Food', icon: '🍔' },
                { label: '음료', value: 'Drink', icon: '🥤' },
                { label: '생활용품', value: 'Toiletries', icon: '🧻' },
                { label: '기타/전체', value: 'Others', icon: '�' }
            ]
        },
        {
            key: 'priority',
            question: '가장 깐깐하게 볼 조건은?',
            options: [
                { label: '파격적인 역대가', value: 'discount', icon: '💸' },
                { label: '압도적인 댓글 수', value: 'reaction', icon: '🔥' },
                { label: '최고의 품질 평점', value: 'rating', icon: '⭐' }
            ]
        }
    ];

    return (
        <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
        >
            <PopupContainer onClick={(e) => e.stopPropagation()}>

                <AnimatePresence mode="wait">
                    {isAnalyzing ? (
                        <MascotView
                            key="analyzing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <SearchlightBackground />

                            <MascotStage>
                                <motion.div
                                    animate={{
                                        x: [-40, 40, -30, 50, 0],
                                        y: [0, -20, 0, -15, 0],
                                        rotate: [-5, 5, -3, 6, 0]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                    style={{ position: 'relative' }}
                                >
                                    <MagnifyingGlass>×</MagnifyingGlass>
                                    <LogoImage
                                        src="/logo.png"
                                        alt="핫딜 연구소 탐색 중"
                                        width={100}
                                        height={100}
                                        unoptimized
                                    />
                                </motion.div>
                                <Shadow
                                    animate={{
                                        scale: [1, 0.7, 1, 0.6, 1],
                                        opacity: [0.5, 0.2, 0.5, 0.15, 0.5]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                />
                            </MascotStage>

                            <StatusMessageContainer>
                                <AnimatePresence mode="popLayout">
                                    <motion.div
                                        key={currentLog}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <StatusText>{currentLog}</StatusText>
                                    </motion.div>
                                </AnimatePresence>
                            </StatusMessageContainer>

                            <CartProgressContainer>
                                <CartTrack>
                                    <CartFill $width={progress} />
                                    <CartIconWrapper $progress={progress}>
                                        {progress >= 100 ? '🎁' : '🛒'}
                                    </CartIconWrapper>
                                </CartTrack>
                                <ProgressPercentage>{Math.round(progress)}%</ProgressPercentage>
                            </CartProgressContainer>

                        </MascotView>
                    ) : (
                        <SurveyView
                            key="survey"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProgressBar>
                                <Progress $width={((step + 1) / questions.length) * 100} />
                            </ProgressBar>
                            <HeaderSection>
                                <StepIndicator>맞춤 설정 {step + 1}/{questions.length}</StepIndicator>
                                <Question>{questions[step].question}</Question>
                            </HeaderSection>

                            <OptionsGrid>
                                {questions[step].options.map((option, i) => (
                                    <OptionButton
                                        key={option.value}
                                        onClick={() => handleSelect(questions[step].key, option.value)}
                                        $selected={preferences[questions[step].key] === option.value}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <OptionContent>
                                            <OptionIcon>{option.icon}</OptionIcon>
                                            <OptionLabel>{option.label}</OptionLabel>
                                        </OptionContent>
                                        <ArrowIcon>→</ArrowIcon>
                                    </OptionButton>
                                ))}
                            </OptionsGrid>
                        </SurveyView>
                    )}
                </AnimatePresence>
            </PopupContainer>
        </Overlay>
    );
}

const spotlightAnim = keyframes`
    0% { transform: translateX(-50%) translateY(-50%) rotate(-30deg); opacity: 0.3; }
    50% { transform: translateX(50%) translateY(30%) rotate(40deg); opacity: 0.6; }
    100% { transform: translateX(-50%) translateY(-50%) rotate(-30deg); opacity: 0.3; }
`;

const SearchlightBackground = () => (
    <SearchlightWrapper>
        <LightBeam />
    </SearchlightWrapper>
);


// --- STYLED COMPONENTS ---

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const PopupContainer = styled.div`
    background: var(--card-bg);
    width: 90%;
    max-width: 460px;
    padding: 40px;
    border-radius: 28px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    position: relative;
    min-height: 480px;
    display: flex;
    flex-direction: column;
    color: var(--text-primary);
    overflow: hidden;
`;



const SurveyView = styled(motion.div)`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 6px;
    background: var(--secondary);
    border-radius: 3px;
    margin-bottom: 30px;
    overflow: hidden;
`;

const Progress = styled.div<{ $width: number }>`
    width: ${props => props.$width}%;
    height: 100%;
    background: var(--primary);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 3px;
`;

const HeaderSection = styled.div`
    margin-bottom: 36px;
`;

const StepIndicator = styled.div`
    color: var(--primary);
    font-size: 14px;
    font-weight: 800;
    margin-bottom: 12px;
`;

const Question = styled.h2`
    color: var(--text-primary);
    font-size: 26px;
    font-weight: 800;
    line-height: 1.4;
    margin: 0;
    letter-spacing: -0.5px;
    word-break: keep-all;
`;

const OptionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (max-width: 400px) {
        grid-template-columns: 1fr;
    }
`;

const OptionButton = styled(motion.button) <{ $selected?: boolean }>`
    background: ${props => props.$selected ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 255, 255, 0.04)'};
    border: 1px solid ${props => props.$selected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'};
    padding: 24px 20px;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    width: 100%;
    box-shadow: ${props => props.$selected ? '0 8px 24px rgba(0, 200, 83, 0.2)' : '0 4px 12px rgba(0,0,0,0.1)'};
    backdrop-filter: blur(10px);

    &:hover {
        border-color: ${props => props.$selected ? 'var(--primary)' : 'rgba(255,255,255,0.2)'};
        background: ${props => props.$selected ? 'rgba(0, 200, 83, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
    }
`;

const OptionContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const OptionIcon = styled.span`
    font-size: 36px;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
`;

const OptionLabel = styled.span`
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.3px;
    text-align: center;
    word-break: keep-all;
`;

const ArrowIcon = styled.span`
    display: none; // Hide arrow icon in grid layout
`;

const MascotView = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: relative;
    padding-top: 20px;
    color: #fff; /* Force white text for dark searchlight bg */
    border-radius: inherit;
`;

const SearchlightWrapper = styled.div`
    position: absolute;
    inset: -20px;
    background: #1a1a1a;
    overflow: hidden;
    z-index: 0;
    border-radius: inherit;
`;

const LightBeam = styled.div`
    position: absolute;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(255, 235, 150, 0.4) 0%, rgba(255, 235, 150, 0) 60%);
    top: 50%;
    left: 50%;
    margin-top: -400px;
    margin-left: -400px;
    pointer-events: none;
    transform-origin: center;
    animation: ${spotlightAnim} 5s infinite ease-in-out alternate;
    mix-blend-mode: overlay;
`;

const MascotStage = styled.div`
    position: relative;
    width: 180px;
    height: 160px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
`;

const LogoImage = styled(Image)`
    object-fit: contain;
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
    border-radius: 50%;
    background: #fff;
    padding: 10px;
`;

const MagnifyingGlass = styled.div`
    position: absolute;
    right: -10px;
    bottom: -10px;
    background: #fff;
    color: #000;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    z-index: 12;
    transform: rotate(-15deg);
    
    &::after {
        content: "🔍";
        position: absolute;
        font-size: 20px;
    }
`;

const Shadow = styled(motion.div)`
    width: 80px;
    height: 12px;
    background: rgba(0,0,0,0.6);
    border-radius: 50%;
    margin-top: 10px;
    filter: blur(4px);
`;

const StatusMessageContainer = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    z-index: 10;
    text-align: center;
`;

const StatusText = styled.div`
    font-size: 17px;
    font-weight: 700;
    line-height: 1.4;
    word-break: keep-all;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    background: rgba(0,0,0,0.4);
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
`;

const CartProgressContainer = styled.div`
    width: 100%;
    z-index: 10;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const CartTrack = styled.div`
    width: 100%;
    height: 12px;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    position: relative;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
`;

const CartFill = styled.div<{ $width: number }>`
    width: ${props => props.$width}%;
    height: 100%;
    background: linear-gradient(90deg, #00c853 0%, #69f0ae 100%);
    border-radius: 8px;
    transition: width 0.3s ease-out;
    box-shadow: 0 0 10px rgba(0, 200, 83, 0.5);
`;

const CartIconWrapper = styled.div<{ $progress: number }>`
    position: absolute;
    top: 50%;
    left: ${props => props.$progress}%;
    transform: translate(-50%, -50%) ${props => props.$progress < 100 ? 'scaleX(-1)' : 'scaleX(1)'};
    font-size: 28px;
    transition: left 0.3s ease-out;
    filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));
    z-index: 20;
    margin-top: -10px; /* Ride exactly on the track */
`;

const ProgressPercentage = styled.div`
    font-size: 18px;
    font-weight: 800;
    color: #69f0ae;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

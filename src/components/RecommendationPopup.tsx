'use client';

import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getRecommendationFromPrompt } from '@/app/actions';

interface RecommendationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (result: any) => void;
}

export default function RecommendationPopup({ isOpen, onClose, onComplete }: RecommendationPopupProps) {
    const [prompt, setPrompt] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentLog, setCurrentLog] = useState<string>('핫딜 연구원이 고객님의 말씀을 듣고 있습니다... 🧐');
    const [progress, setProgress] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isAnalyzingRef = useRef(false);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                isAnalyzingRef.current = false;
                setIsAnalyzing(false);
                setPrompt('');
                setCurrentLog('핫딜 연구원이 고객님의 말씀을 듣고 있습니다... 🧐');
                setProgress(0);
            }, 500);
        } else {
            // Focus textarea when opened
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!prompt.trim() || isAnalyzing || isAnalyzingRef.current) return;

        isAnalyzingRef.current = true;
        setIsAnalyzing(true);
        setCurrentLog('AI가 추천 상품을 샅샅이 검색하고 있어요 🏃‍♂️💨');
        setProgress(20);

        // Fake progress bar while waiting for AI
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 85) return 85; // Stop at 85% until AI finishes
                return prev + Math.random() * 5;
            });
        }, 500);

        const res = await getRecommendationFromPrompt(prompt);
        clearInterval(progressInterval);

        if (res.success) {
            setProgress(100);
            setCurrentLog(res.aiData?.ai_comment || '최고의 핫딜을 찾았습니다! ✨');

            setTimeout(() => {
                onComplete({
                    data: res.data,
                    aiData: res.aiData,
                });
                onClose();
            }, 2500); // 2.5 seconds to read the comment
        } else {
            setCurrentLog('앗, 추천 중 문제가 발생했어요 😢 다시 시도해주세요.');
            setTimeout(() => {
                isAnalyzingRef.current = false;
                setIsAnalyzing(false);
                setProgress(0);
            }, 3000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

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
                        <PromptView
                            key="prompt"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <HeaderSection>
                                <Question>무엇을 찾고 계신가요?<br />핫딜 연구원에게 물어보세요!</Question>
                            </HeaderSection>

                            <InputWrapper>
                                <SearchTextarea
                                    ref={textareaRef}
                                    placeholder="예) 이번 주말 캠핑 갈 건데 가성비 먹거리 추천해줘"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <SubmitButton
                                    onClick={handleSubmit}
                                    disabled={!prompt.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    전송 🚀
                                </SubmitButton>
                            </InputWrapper>
                        </PromptView>
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



const PromptView = styled(motion.div)`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
`;

const HeaderSection = styled.div`
    margin-bottom: 24px;
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

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
    margin-top: 20px;
`;

const SearchTextarea = styled.textarea`
    width: 100%;
    height: 140px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    color: var(--text-primary);
    font-size: 16px;
    line-height: 1.5;
    resize: none;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: var(--primary);
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.15), inset 0 2px 8px rgba(0,0,0,0.2);
    }

    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.7;
    }
`;

const SubmitButton = styled(motion.button)`
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: var(--primary);
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);

    &:disabled {
        background: #555;
        cursor: not-allowed;
        box-shadow: none;
        opacity: 0.5;
    }
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

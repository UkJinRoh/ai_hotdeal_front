import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface AIPipelineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AIPipelineModal({ isOpen, onClose }: AIPipelineModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <ModalContainer
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                >
                    <CloseButton onClick={onClose}>✕</CloseButton>
                    <Header>
                        <Title>✨ AI 맞춤 추천은 어떻게 작동하나요?</Title>
                        <Subtitle>핫딜 연구소가 완벽한 상품을 찾아내는 4단계 과정</Subtitle>
                    </Header>

                    <PipelineGrid>
                        <StepCard>
                            <StepNumber>1</StepNumber>
                            <StepIcon>💬</StepIcon>
                            <StepTitle>질문 입력</StepTitle>
                            <StepDesc>사용자가 원하는 핫딜 조건을 자연어로 자유롭게 입력합니다.</StepDesc>
                        </StepCard>

                        <Arrow>➔</Arrow>

                        <StepCard>
                            <StepNumber>2</StepNumber>
                            <StepIcon>🧠</StepIcon>
                            <StepTitle>AI 분석</StepTitle>
                            <StepDesc>Gemini AI가 문맥을 파악해 카테고리와 구체적인 검색 키워드를 추출합니다.</StepDesc>
                        </StepCard>

                        <Arrow>➔</Arrow>

                        <StepCard>
                            <StepNumber>3</StepNumber>
                            <StepIcon>🔍</StepIcon>
                            <StepTitle>DB 교차 검색</StepTitle>
                            <StepDesc>Supabase 실시간 데이터베이스에서 키워드를 매칭하고 점수순으로 정렬합니다.</StepDesc>
                        </StepCard>

                        <Arrow>➔</Arrow>

                        <StepCard>
                            <StepNumber>4</StepNumber>
                            <StepIcon>🎁</StepIcon>
                            <StepTitle>맞춤 핫딜 제공</StepTitle>
                            <StepDesc>가장 추천할 만한 핫딜을 선별하여 다정한 AI 코멘트와 함께 보여줍니다.</StepDesc>
                        </StepCard>
                    </PipelineGrid>

                    <BottomNote>
                        💡 AI는 사용자의 요청이 넓은 의미일 경우 강제 키워드 필터링을 생략하여 더욱 폭넓은 결과를 제시하도록 똑똑하게 설계되어 있습니다.
                    </BottomNote>
                </ModalContainer>
            </Overlay>
        </AnimatePresence>
    );
}

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
`;

const ModalContainer = styled(motion.div)`
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px;
    width: 90%;
    max-width: 900px;
    position: relative;
    box-shadow: 0 24px 48px rgba(0,0,0,0.4);
    color: var(--text-primary);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 24px;
    right: 24px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: var(--text-primary);
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 40px;
`;

const Title = styled.h2`
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
    background: linear-gradient(90deg, #00c853, #69f0ae);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: var(--text-secondary);
`;

const PipelineGrid = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 24px;
        align-items: center;
    }
`;

const Arrow = styled.div`
    color: var(--border);
    font-size: 24px;
    align-self: center;

    @media (max-width: 768px) {
        transform: rotate(90deg);
    }
`;

const StepCard = styled.div`
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    position: relative;
    transition: transform 0.3s, background 0.3s;

    &:hover {
        transform: translateY(-5px);
        background: rgba(0, 200, 83, 0.05);
        border-color: rgba(0, 200, 83, 0.3);
    }
`;

const StepNumber = styled.div`
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: #000;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
    box-shadow: 0 4px 8px rgba(0, 200, 83, 0.4);
`;

const StepIcon = styled.div`
    font-size: 40px;
    margin-bottom: 16px;
    margin-top: 8px;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
`;

const StepTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--text-primary);
`;

const StepDesc = styled.p`
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
    word-break: keep-all;
`;

const BottomNote = styled.div`
    margin-top: 40px;
    text-align: center;
    font-size: 14px;
    color: var(--text-secondary);
    background: rgba(255, 255, 255, 0.02);
    padding: 16px;
    border-radius: 12px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
`;

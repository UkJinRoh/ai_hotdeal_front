'use client';

import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface CustomAlertProps {
    message: string;
    duration?: number;
    onClose: () => void;
}

const CustomAlert = ({ message, duration = 3000, onClose }: CustomAlertProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <Container $isVisible={isVisible}>
            <Content>{message}</Content>
            {/* Clockwise Borders */}
            <BorderTop $duration={duration} />
            <BorderRight $duration={duration} />
            <BorderBottom $duration={duration} />
            <BorderLeft $duration={duration} />
        </Container>
    );
}

export default CustomAlert;

const fadeIn = keyframes`
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
`;

const fadeOut = keyframes`
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, 20px); }
`;

const Container = styled.div<{ $isVisible: boolean }>`
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #222;
    color: #fff;
    padding: 16px 40px;
    border-radius: 4px; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    z-index: 9999;
    font-size: 14px;
    border: 1px solid #333; 
    overflow: hidden; 
    
    animation: ${props => props.$isVisible ? fadeIn : fadeOut} 0.3s forwards;
`;

const Content = styled.div`
    position: relative;
    z-index: 2;
    font-weight: 500;
`;

const lineAnim = keyframes`
    to { transform: scaleX(1); }
`;
const lineAnimY = keyframes`
    to { transform: scaleY(1); }
`;

const BorderBase = styled.div<{ $duration: number }>`
    position: absolute;
    background: #fff;
    z-index: 1;
`;

const BorderTop = styled(BorderBase)`
    top: 0; left: 0; width: 100%; height: 3px;
    transform-origin: left;
    transform: scaleX(0);
    animation: ${lineAnim} ${props => props.$duration / 4}ms linear forwards;
`;

const BorderRight = styled(BorderBase)`
    top: 0; right: 0; width: 3px; height: 100%;
    transform-origin: top;
    transform: scaleY(0);
    animation: ${lineAnimY} ${props => props.$duration / 4}ms linear ${props => props.$duration / 4}ms forwards;
`;

const BorderBottom = styled(BorderBase)`
    bottom: 0; right: 0; width: 100%; height: 3px;
    transform-origin: right;
    transform: scaleX(0);
    animation: ${lineAnim} ${props => props.$duration / 4}ms linear ${props => props.$duration * 2 / 4}ms forwards;
`;

const BorderLeft = styled(BorderBase)`
    bottom: 0; left: 0; width: 3px; height: 100%;
    transform-origin: bottom;
    transform: scaleY(0);
    animation: ${lineAnimY} ${props => props.$duration / 4}ms linear ${props => props.$duration * 3 / 4}ms forwards;
`;

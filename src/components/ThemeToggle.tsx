'use client';

import styled from 'styled-components';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <TogglePlaceholder />;

    return (
        <ToggleButton onClick={toggleTheme} aria-label="테마 변경">
            <ToggleTrack $isDark={theme === 'dark'}>
                <ToggleIcon $isDark={theme === 'dark'}>
                    {theme === 'dark' ? '🌙' : '☀️'}
                </ToggleIcon>
            </ToggleTrack>
        </ToggleButton>
    );
}

const ToggleButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: auto; /* Push to the right */
`;

const TogglePlaceholder = styled.div`
    width: 48px;
    height: 26px;
    margin-left: auto;
`;

const ToggleTrack = styled.div<{ $isDark: boolean }>`
    width: 50px;
    height: 26px;
    background-color: ${props => props.$isDark ? '#333' : '#ddd'};
    border-radius: 13px;
    position: relative;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    padding: 2px;
`;

const ToggleIcon = styled.div<{ $isDark: boolean }>`
    width: 22px;
    height: 22px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transform: ${props => props.$isDark ? 'translateX(24px)' : 'translateX(0)'};
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

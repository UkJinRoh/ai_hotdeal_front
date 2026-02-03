'use client';

import styled from 'styled-components';

export const Page = styled.div`
  --background: #fafafa;
  --foreground: #fff;
  --text-primary: #000;
  --text-secondary: #666;
  --button-primary-hover: #383838;
  --button-secondary-hover: #f2f2f2;
  --button-secondary-border: #ebebeb;

  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background-color: var(--background);

  @media (prefers-color-scheme: dark) {
    --background: #000;
    --foreground: #000;
    --text-primary: #ededed;
    --text-secondary: #999;
    --button-primary-hover: #ccc;
    --button-secondary-hover: #1a1a1a;
    --button-secondary-border: #1a1a1a;
  }
`;

export const Main = styled.main`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  background-color: var(--foreground);
  padding-top: 120px;
  padding-bottom: 120px;
`;

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
`;


export const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
`;

export const LogoWrapper = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
`;

export const StyledTitle = styled(Title)`
    margin-bottom: 0;
    margin-left: 12px;
    font-weight: 700;
`;


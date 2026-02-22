'use client';

import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background-color: var(--background);
  color: var(--text-primary);
`;

export const Main = styled.main`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 120px;
  padding-bottom: 120px;
  transition: background-color 0.3s ease;
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
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
`;

export const LogoTitleGroup = styled.div`
    display: flex;
    align-items: center;
`;

export const LogoWrapper = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background-color: var(--logo-bg);
`;

export const StyledTitle = styled(Title)`
    margin-bottom: 0;
    margin-left: 12px;
    font-weight: 700;
`;


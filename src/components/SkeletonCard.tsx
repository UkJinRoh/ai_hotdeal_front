'use client';

import styled, { keyframes, css } from 'styled-components';

export default function SkeletonCard() {
    return (
        <CardWrapper>
            <SkeletonItem>
                <ImagePlaceholder />
                <ContentPlaceholder>
                    <TitleLine />
                    <TitleLine style={{ width: '80%' }} />
                    <PriceLine />
                    <InfoLine />
                </ContentPlaceholder>
            </SkeletonItem>
        </CardWrapper>
    );
}

const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

const skeletonAnimation = css`
    background: linear-gradient(90deg, var(--secondary) 25%, var(--border) 37%, var(--secondary) 63%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite linear;
`;

const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 400px;
    gap: 8px;
`;

const SkeletonItem = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    overflow: hidden;
`;

const ImagePlaceholder = styled.div`
    width: 100%;
    height: 200px;
    ${skeletonAnimation}
    border-bottom: 1px solid var(--border);
`;

const ContentPlaceholder = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
`;

const TitleLine = styled.div`
    height: 20px;
    width: 100%;
    border-radius: 4px;
    ${skeletonAnimation}
`;

const PriceLine = styled.div`
    height: 30px;
    width: 60%;
    border-radius: 4px;
    margin-top: 10px;
    ${skeletonAnimation}
`;

const InfoLine = styled.div`
    height: 20px;
    width: 40%;
    border-radius: 4px;
    margin-top: auto;
    ${skeletonAnimation}
`;

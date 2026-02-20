'use client';

import Image from 'next/image';
import styled from 'styled-components';

export default function ThemeLogo() {
    return (
        <LogoWrapper>
            <StyledLogo
                src="/logo.png?v=2"
                alt="핫딜 연구소 로고"
                width={100}
                height={100}
                unoptimized
            />
        </LogoWrapper>
    );
}

const LogoWrapper = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
`;

const StyledLogo = styled(Image)`
    object-fit: contain;
    display: block;
`;

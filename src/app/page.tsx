import Dashboard from "../components/Dashboard";
import { Page, Main, HeaderContainer, LogoWrapper, StyledTitle } from "./Page.styles";
import Image from 'next/image';

export default async function Home() {
  return (
    <Page>
      <Main className="inner">
        <HeaderContainer>
          <LogoWrapper>
            <Image src="/logo.png" alt="핫딜 연구소 로고" width={100} height={100} style={{ objectFit: 'cover' }} />
          </LogoWrapper>
          <StyledTitle>핫딜 연구소</StyledTitle>
        </HeaderContainer>
        <Dashboard />
      </Main>
    </Page>
  );
}
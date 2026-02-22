import Dashboard from "../components/Dashboard";
import { Page, Main, HeaderContainer, LogoWrapper, StyledTitle, LogoTitleGroup } from "./Page.styles";
import ThemeLogo from "../components/ThemeLogo";
import ThemeToggle from "../components/ThemeToggle";

export default async function Home() {
  return (
    <Page>
      <Main className="inner">
        <HeaderContainer>
          <LogoTitleGroup>
            <LogoWrapper>
              <ThemeLogo />
            </LogoWrapper>
            <StyledTitle> 핫딜 연구소</StyledTitle>
          </LogoTitleGroup>
          <ThemeToggle />
        </HeaderContainer>
        <Dashboard />
      </Main>
    </Page>
  );
}
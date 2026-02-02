'use client';

import styled from 'styled-components';

export default function IntroContainer() {

  return (
    <Container>
      <ContentsWrapper>
        <Title>오늘의 핫딜 브리핑</Title>
        <p>오전 9시, 수집된 700여 건의 핫딜 중, 검증된 80건의 알짜 정보만 큐레이션했습니다.</p>
      </ContentsWrapper>
    </Container>
  );
}


const Container = styled.div`
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  // border: 1px solid #006239;
  // background: #006239;
  border-radius: 18px;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-primary);
`;
'use client';

import styled from 'styled-components';
import IntroContainer from './IntroConatiner';
import CategoryContainer from './CategoryContainer';
import AllContainer from './AllContainer';
import TotalContainer from './TotalContainer';

export default function Dashboard() {

    return (
        <Container>
            <IntroContainer />
            <AllContainer />
            <CategoryContainer categories={['Office', 'Food', 'Drink', 'Toiletries', 'DROP']} />
            <TotalContainer />
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  margin: 20px 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

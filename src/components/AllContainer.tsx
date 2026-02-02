'use client';

import { getOverallTop10 } from '@/app/actions';
import AllCard from "./AllCard";
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function AllContainer() {
    const [allItems, setAllItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchAllTop10 = async () => {
            try {
                const data = await getOverallTop10();
                setAllItems(data || []);
            } catch (e) {
                console.error("Error fetching overall top 10:", e);
            }
        };

        fetchAllTop10();
    }, []);

    return (
        <Container>
            <h2>전체 베스트 핫딜</h2>
            <AllCard items={allItems} />
        </Container>
    );
}

const Container = styled.div`
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;

  h2 {
      font-size: 24px;
      font-weight: 600;
  }
`;

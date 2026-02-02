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
  padding: 120px 60px;
`;

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
`;

/* The original page.tsx had complex structure (intro, ctas) but they were mostly removed/commented out effectively or replaced.
   The current page.tsx (Step 135) only renders <h1> and <CategoryTop>.
   So we just need Page container and Main container.
   And maybe styles for Title.
   The rest (intro, ctas) is unused, so I won't migrate it unless needed.
*/


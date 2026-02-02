// import { supabase } from "../lib/supabase";
import Dashboard from "../components/Dashboard";
import { Page, Main, Title } from "./Page.styles";
import styled from 'styled-components';


export default async function Home() {
  return (
    <Page>
      <Main className="inner">
        <Title>...</Title>
        <Dashboard />
      </Main>
    </Page>
  );
}
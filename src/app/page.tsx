import { supabase } from "../lib/supabase";
import ConsoleLogger from "../components/ConsoleLogger";
import Dashboard from "../components/Dashboard";
import CategoryTop from "../components/CategoryTop";
import styles from "./page.module.scss";


export default async function Home() {
  const { data, error } = await supabase.from('hotdeals').select('*').limit(20);

  if (error) {
    console.error('Error fetching hotdeals:', error);
  } else {
    console.log('Server-side Hotdeals Data:', data);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>핫딜</h1>

        <CategoryTop />

        {/* <Dashboard /> */}
        {/* <ConsoleLogger data={data} /> */}
      </main>
    </div>
  );
}

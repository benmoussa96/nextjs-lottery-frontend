import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import ManulHeader from "../components/ManualHeader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Lottery</title>
        <meta name="description" content="Ethereum Lottery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManulHeader />
      <main className={styles.main}>Hello!</main>
    </>
  );
}

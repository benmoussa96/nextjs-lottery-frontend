import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Inter } from "@next/font/google";
// import HeaderFromScratch from "../components/HeaderFromScratch";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lottery</title>
        <meta name="description" content="Ethereum Lottery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <HeaderFromScratch /> */}
      <Header />
      <LotteryEntrance />
    </div>
  );
}

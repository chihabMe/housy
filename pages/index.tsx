import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";
import { date } from "zod";

export default function Home() {
  useEffect(() => {
    fetch("/api/v1/hello")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return (
    <>
      <Head>
        <title>app</title>
      </Head>
      <main className={styles.main}>hello</main>
    </>
  );
}

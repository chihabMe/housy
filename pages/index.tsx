import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/v1/hello")
      .then((res) => res.json())
      .then(async (data) =>
        setTimeout(() => {
          setMessage(data);
        }, 1000)
      );
  }, []);
  return (
    <>
      <Head>
        <title>{message}</title>
      </Head>
      <main className={styles.main}>{message ?? "loading"}</main>
    </>
  );
}

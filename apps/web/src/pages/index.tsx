import { GetServerSideProps } from "next";
import { Button } from "ui";
import { helloEndpoint } from "../../endpointes";

export default function Web({ data }: { data: string }) {
  return (
    <div>
      <h1>Web</h1>
      {data}
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const response = await fetch(helloEndpoint);
    const data: string = await response.json();
    return {
      props: {
        data,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};

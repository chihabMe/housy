import { GetServerSideProps } from "next";
import { Button } from "ui";

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
    const response = await fetch("http://localhost:3001/api/v1/hello");
    const data: string = await response.json();
    console.log(data, response.status);
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

import { GetServerSideProps, NextPageContext } from "next";
import React from "react";
interface profile {
  email: string;
  id: string;
  username: string;
}
const index = ({ profile }: { profile: profile }) => {
  return (
    <div>
      <div>{profile.email}</div>
      <div>{profile.username}</div>
      <div>{profile.id}</div>
    </div>
  );
};

export default index;

const prefixEndpoint = (endpoint: string, host: string) => {
  const protocol = process.env.MODE == "production" ? "https" : "http";
  return protocol + "://" + host + endpoint;
};
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const host = context.req!.headers.host as string;
    const endpoint = prefixEndpoint("/api/v1/accounts/me", host);
    console.log(endpoint);
    const cookies = context.req!.headers.cookie;
    const response = await fetch(endpoint, {
      method: "get",
      headers: {
        cookie: cookies as string,
      },
    });
    if (response.status != 200)
      return {
        redirect: {
          destination: "/auth/login",
        },
      };
    const data = await response.json();
    return {
      props: {
        profile: data.data as profile,
      },
    };
  } catch (er) {
    return {
      notFound: true,
    };
  }
};

export const extractAuthCookiesFromHeaders = (headers: any) => {
  const cookies = headers["set-cookie"];
  const refresh = (cookies[0] as string).split(";")[0].split("=");
  const access = (cookies[1] as string).split(";")[0].split("=");
  return {
    refresh: refresh[1],
    access: access[1],
  };
};

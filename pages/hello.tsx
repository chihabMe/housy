import React, { useEffect, useState } from "react";

const hello = () => {
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    fetch("/api/v1/hello")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
      });
  }, []);
  return <div>{data}</div>;
};

export default hello;

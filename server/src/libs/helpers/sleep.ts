export default async (time: number) =>
  await setTimeout(() => {
    console.log("sleeping ...");
  }, time);

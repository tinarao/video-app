import app from './app';

const main = async () => {
  const port = process.env.PORT || 3133;

  Bun.serve({
    port: port,
    fetch: app.fetch,
  });

  console.log(`Serving at ${port}`);
};

main();

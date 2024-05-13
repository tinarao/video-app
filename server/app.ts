import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { routesSetup } from './routes';

const bootstrap = (): Hono => {
  const app = new Hono();
  // mw
  app.use(logger());

  // healthcheck
  app.get('/hc', (c) => c.text('дышим!', 200));
  routesSetup(app);

  return app;
};

export default bootstrap();

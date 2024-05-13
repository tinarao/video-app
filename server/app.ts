import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { routesSetup } from './routes';
import { serveStatic } from 'hono/bun';

const bootstrap = (): Hono => {
  const app = new Hono();
  // mw
  app.use(logger());

  // healthcheck
  app.get('/hc', (c) => c.text('дышим!', 200));
  routesSetup(app);

  // static
  app.get('*', serveStatic({ root: './frontend/dist' }))
  app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

  return app;
};

export default bootstrap();

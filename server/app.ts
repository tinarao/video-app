import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import { videosRoute } from './routes/video';
import { authRoute } from './routes/auth';

const app = new Hono();
// mw
app.use(logger());

// healthcheck
app.get('/hc', (c) => c.text('дышим!', 200));
const apiRoutes = app
    .basePath('/api')
    .route("/auth", authRoute)
    .route('/videos', videosRoute)

// static
app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;

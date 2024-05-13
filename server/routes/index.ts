import { videosRoute } from './video';
import type { Hono } from 'hono';

export const routesSetup = (app: Hono) => {
  app.route('/api/videos', videosRoute);
};

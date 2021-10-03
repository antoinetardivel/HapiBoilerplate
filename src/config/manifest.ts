import { Manifest } from '@hapi/glue';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { badRequest } from '@hapi/boom';
import { port } from './config';

export const manifest: Manifest = {
  server: {
    routes: {
      cors: true,
      security: true,
      response: {
        failAction: 'log',
      },
      validate: {
        failAction: async (request: Request, h: ResponseToolkit, err) => {
          if (process.env.NODE_ENV !== 'production') {
            return badRequest(err?.message);
          } else {
            return badRequest();
          }
        },
      },
    },

    router: {
      isCaseSensitive: false,
    },
    port,
    debug: {
      request: ['error'],
    },
  },

  register: {
    plugins: [
      {
        plugin: 'hapi-auth-jwt2',
      },
      {
        plugin: './core/JWT',
      },
      {
        plugin: './api/elements',
        options: { routes: { prefix: '/elements' } },
      },
      {
        plugin: './api/users',
        options: { routes: { prefix: '/users' } },
      },
      {
        plugin: './api/auth',
        options: { routes: { prefix: '/' } },
      },
    ],
  },
};

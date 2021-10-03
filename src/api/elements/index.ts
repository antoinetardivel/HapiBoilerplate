import { Plugin, PluginBase, Server } from '@hapi/hapi';
import { ElementsController } from './controllers';
import { elementValidator } from './validators';
import { objectIdValidator } from '../../services/validators';

const controller = new ElementsController();

export const plugin: Plugin<PluginBase<void>> = {
  name: 'elementRoutes',
  version: '1.0.0',
  register: (server: Server) => {
    server.bind(controller);
    server.route([
      {
        method: 'POST',
        path: '/elements',
        handler: controller.createElement,
        options: {
          tags: ['api'],
          validate: { payload: elementValidator },
        },
      },
      {
        method: 'GET',
        path: '/elements',
        handler: controller.getElements,
        options: {
          tags: ['api'],
        },
      },
      {
        method: 'GET',
        path: '/elements/{id}',
        handler: controller.getElements,
        options: {
          tags: ['api'],
          validate: { params: objectIdValidator },
        },
      },
      {
        method: 'PUT',
        path: '/elements/{id}',
        handler: controller.updateElement,
        options: {
          tags: ['api'],
          validate: { payload: elementValidator },
        },
      },
      {
        method: 'DELETE',
        path: '/elements/{id}',
        handler: controller.deleteElement,
        options: {
          tags: ['api'],
          validate: { params: objectIdValidator },
        },
      },
    ]);
  },
};

export default plugin;

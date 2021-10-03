import { Plugin, PluginBase, Server } from '@hapi/hapi';
import { AuthController } from './controllers';
import { loginValidator, forgotPasswordValidator, resetPasswordValidator } from './validators';

const controller = new AuthController();

export const plugin: Plugin<PluginBase<void>> = {
  name: 'authRoutes',
  version: '1.0.0',
  register: (server: Server) => {
    server.bind(controller);
    server.route([
      {
        method: 'POST',
        path: '/login',
        handler: controller.login,
        options: {
          validate: { payload: loginValidator },
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/forgot-password',
        handler: controller.forgotPassword,
        options: {
          validate: {
            payload: forgotPasswordValidator,
          },
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/reset-password',
        handler: controller.resetPassword,
        options: {
          validate: {
            payload: resetPasswordValidator,
          },
          auth: false,
        },
      },
    ]);
  },
};

export default plugin;

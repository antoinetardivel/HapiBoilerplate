import { Plugin, PluginBase, Server } from "@hapi/hapi";
import { UsersController } from "./controllers";
import {
  activeUserValidation,
  createUserValidator,
  updateUserPasswordValidator,
  updateUserValidator,
  userValidator,
} from "./validators";
import { objectIdValidator } from "../../services/validators";

const controller = new UsersController();

export const plugin: Plugin<PluginBase<void>> = {
  name: "usersRoutes",
  version: "1.0.0",
  register: (server: Server) => {
    server.bind(controller);
    server.route([
      {
        method: "POST",
        path: "/users",
        handler: controller.createUser,
        options: {
          tags: ["api"],
          validate: { payload: createUserValidator },
        },
      },
      // {
      //   method: "POST",
      //   path: "/users/{id}/reset-password",
      //   handler: controller.startResetPassword,
      //   options: {
      //     validate: { payload: usersValidator },
      //   },
      // },
      {
        method: "GET",
        path: "/users",
        handler: controller.getUsers,
        options: {
          tags: ["api"],
        },
      },
      {
        method: "GET",
        path: "/users/{id}",
        handler: controller.getUsers,
        options: {
          tags: ["api"],
          validate: { params: objectIdValidator },
        },
      },
      {
        method: "PUT",
        path: "/users/{id}",
        handler: controller.updateUser,
        options: {
          tags: ["api"],
          validate: { payload: updateUserValidator },
        },
      },
      {
        method: "PUT",
        path: "/users/{id}/update-password",
        handler: controller.updateUserPassword,
        options: {
          tags: ["api"],
          validate: { payload: updateUserPasswordValidator },
        },
      },
      {
        method: "PUT",
        path: "/active-account",
        handler: controller.updateUserActivationState,
        options: {
          tags: ["api"],
          validate: { payload: activeUserValidation },
          auth: false,
        },
      },
      // {
      //   method: "PUT",
      //   path: "/users/{id}/reset-password",
      //   handler: controller.updateUserPassword,
      //   options: {
      //     validate: { payload: userValidator },
      //   },
      // },
      {
        method: "DELETE",
        path: "/users/{id}",
        handler: controller.deleteUsers,
        options: {
          tags: ["api"],
          validate: { params: objectIdValidator },
        },
      },
    ]);
  },
};

export default plugin;

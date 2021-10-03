import { PluginBase, Plugin } from "@hapi/hapi";
import { Server } from "@hapi/hapi";
import { sign, verify, decode as decodeJWT } from "jsonwebtoken";
import { tokenInfo } from "../config/config";

export interface IJwtPayload {
  firstname: String;
  lastname: String;
  id: String;
  email: String;
}

export interface IDecodedJwt extends IJwtPayload {
  iss: string;
  iat: number;
  exp: number;
}

export interface ICredentials {
  user: IJwtPayload;
}

export class JWT {
  public static async encode(payload: IJwtPayload | any): Promise<string> {
    if (!tokenInfo.secret)
      throw new Error(
        "JWT Token secret is not set! Set environement variable TOKEN_SECRET."
      );

    return sign(payload, tokenInfo.secret as string, {
      issuer: tokenInfo.issuer,
      algorithm: "HS256",
      expiresIn: tokenInfo.accessTokenValidity,
    });
  }

  public static async decode(token: string) {
    if (!tokenInfo.secret)
      throw new Error(
        "JWT Token secret is not set! Set environement variable TOKEN_SECRET."
      );

    const data = verify(token, tokenInfo.secret as string) as IJwtPayload;
    return data;
  }

  public static async decodeNoVerify(token: string) {
    if (!tokenInfo.secret)
      throw new Error(
        "JWT Token secret is not set! Set environement variable TOKEN_SECRET."
      );

    const data = decodeJWT(token) as IJwtPayload;
    return data;
  }

  public static async validate(token: IDecodedJwt): Promise<{
    isValid: boolean;
    credentials: ICredentials;
  }> {
    const { ...user } = token;
    return {
      isValid: true,
      credentials: { user },
    };
  }
}

export const plugin: Plugin<PluginBase<void>> = {
  name: "auth",
  version: "1.0.0",
  register: (server: Server) => {
    server.auth.strategy("jwt", "jwt", {
      key: tokenInfo.secret,
      validate: JWT.validate,
      verifyOptions: { algorithms: ["HS256"] },
    });
    server.auth.default("jwt");
  },
};

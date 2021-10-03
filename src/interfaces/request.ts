import { RequestAuth, Request } from "@hapi/hapi";
import { ICredentials } from "../core/JWT";

type IGenCredentials = Omit<ICredentials, "scope"> & { scope: string[] };

export interface IRequestAuth extends RequestAuth {
  credentials: IGenCredentials;
}

export interface IRequest extends Request {
  auth: IRequestAuth;
}

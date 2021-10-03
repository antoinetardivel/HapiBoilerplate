import * as dotenv from 'dotenv';

dotenv.config();

export const port = process.env.SERVER_PORT || 8080;
export const host = process.env.SERVEUR_HOST || 'localhost';

export const db = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PWD || '',
};

export const tokenInfo = {
  accessTokenValidity: '24h',
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
  secret: process.env.TOKEN_SECRET,
};

export const mj = {
  apikey: process.env.MJ_APIKEY_PUBLIC || '',
  apisecret: process.env.MJ_APIKEY_PRIVATE || '',
  templates: {
    ACTIVATE_ACCOUNT: 3224734,
    FORGOT_PASSWORD: 3053907,
    PASSWORD_CHANGE_SUCCESS: 3053900,
  },
};

export const clientUrl = process.env.CLIENTURL;

export const auth = { saltRounds: 10 };

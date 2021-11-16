# Hapi api boilerplate

```

          ____        _ __                __      __
         / __ )____  (_) /__  _________  / /___ _/ /____
        / __  / __ \/ / / _ \/ ___/ __ \/ / __ `/ __/ _ \
       / /_/ / /_/ / / /  __/ /  / /_/ / / /_/ / /_/  __/
      /_____/\____/_/_/\___/_/  / .___/_/\__,_/\__/\___/
                               /_/


```

##### Usefull to create api faster

## Stack:

- Hapi
- MongoDB
- MailJet
- Typegoose
- TypeScript
- JsonWebToken
- Bcrypt

## Installation

The api requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd theFolder
npm i
npm run build
npm run start
```

Create an .env file at the root of your project and fill it with the necessary environment variables.

```sh
# Mongodb access
DB_NAME=
DB_PORT=
DB_HOST=
DB_USER=
DB_PWD=

# Api encryption
TOKEN_SECRET=

# Mailjet api keys
MJ_APIKEY_PUBLIC=
MJ_APIKEY_PRIVATE=

CLIENTURL=http://localhost:3000
NODE_ENV=dev
```

## Development

```sh
npm run dev
```

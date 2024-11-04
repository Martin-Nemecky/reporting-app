# Getting Started

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Used Technologies

- NestJS
- TypeScript

## Technique used for generating secrets:

```
node -p "require('crypto').randomBytes(24).toString('base64url')"
```

```
mkdir secrets
cd secrets/
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./localhost-key.pem -out ./localhost.pem
```

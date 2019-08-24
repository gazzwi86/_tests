# TweetDuino

> Flashing LED's when a tweet is detected

## Setup

Firstly add your own credentials for twitter from your new [twitter app](https://apps.twitter.com/app/):

- consumer_key
- consumer_secret
- access_token
- access_token_secret

Open the Arduino app and upload the standard meta firmware (File > Examples > Firmata > StandardFirmata)

Install the projects dependancies

```bash
npm install -g node-gyp
yarn
```

Then run the project:

```bash
node server.js
```
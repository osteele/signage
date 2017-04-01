# Digital Signage Manager

A web application to (1) manage a playlist for digital signage, and (2) drive a browser that displays the signage.

## Install

1. Install `node`. Optionally install `yarn`. On macOS: `brew install yarn`.

2. `npm install` or `yarn`.

3. Create a Firebase account. Create a file `src/firebasejson` with the configuration information. It should look like `src/firebase.json.template`.

## Develop

`npm start` or `yarn start`

## Configure Deployment

[These instructions deploy as a static single-page application on Firebase.]

1. `npm install -g firebase-tools` or `yarn global add firebase-tools`.

2. `firebase init`. Don't overwrite existing files.

## Deploy

`firebase deploy`

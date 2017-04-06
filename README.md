# Digital Signage Manager

A web application to (1) manage a playlist for digital signage, and (2) drive a browser that displays the signage.

## Install

These instructions use the [Yarn](https://yarnpkg.com) package manager. See

1. Install `node` and `yarn`. On macOS: `brew install node yarn`.

2. Install packages: execute `yarn`.

3. Create a Firebase account. Create a file `src/config/firebase.json` with the configuration information. It should look like `src/config/firebase.json.template`.


## Develop

Execute `yarn start`.


## Configure Deployment

[These instructions deploy as a static single-page application on Firebase.]

1. `yarn global add firebase-tools`.

2. `firebase init`. Don't overwrite existing files.


## Deploy

`yarn deploy`


## Appendix: A note on Yarn

These instructions use [yarn](https://yarnpkg.com). To use `npm` instead, use the following substitutions.

yarn                             | npm
---------------------------------|--------------------------------
`yarn`                           | `npm install`
`yarn start`                     | `npm start`
`yarn global add firebase-tools` | `npm install -g firebase-tools`
`yarn deploy`                    | `npm run deploy`

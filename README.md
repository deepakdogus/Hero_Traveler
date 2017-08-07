# HERO Traveler project

This is a monorepo containing all HERO Traveler project code.

## Project setup

Install necessary global packages and install/link all projects modules:

### 1. Install cocoapods & pods

```bash
# Xcode 7 + 8
$ (sudo) gem install cocoapods
$ cd packages/HeroTravelerMobile/ios
$ pod install
```

### 2. Node & NPM

We are hosting several dependencies on our own private npm server, located at https://npm.abeck.io/

First you'll need to contact `andrew at rehashstudio dot com` to enable user registration.
Next create a user with `npm adduser --registry  https://npm.abeck.io`
After registration, we will close any future registrations, as our private npm will be accessible to anyone registered

This project has only been tested on v7.7.2):

```bash
nvm use 7.7.2
npm set registry https://npm.abeck.io
npm i -g react-native-cli
npm i
npm run bootstrap
```

## Running the project locally

Start the API project:

```bash
cd packages/express-api
npm run dev
```

Next, start react-native in a simulator:

```bash
cd packages/HeroTravelerMobile
react-native run-ios
```

_Note: Android has been neglected for the v1, and does not work yet._

To run the application in development mode on your phone, open xcode with the following command: 

```bash
$ open packages/HeroTravelerMobile/ios/HeroTravelerMobile.xcworkspace
```

## Development troubleshooting tips (please read)

* Always keep the React Native **debug browser window visible and in its own tab**. Otherwise, the application will sometimes not startup (it'll get stuck on the splash screen) or it will get stuck on the launch screen's picture (the night sky image). If this happens, close the app or refresh the window (respectively) after moving the debug window to the foreground
* Always close xcode, react-native packager, and simulator before moving to a new branch, or updating an existing branch
* If you are on a clean branch and the application crashes before getting to the launch screen, use xcode to debug the problem
* If you are on a clean branch and get errors after the splash screen, try to run `npm run newclear` which will reset caches, temporary iOS builds, etc.
* Session information is stored on the device in the `state.session` part of the Redux store. **You can clear all locally saved application data by changing the `Config/ReduxPersist.js` version number to something different.**
* Create a .env file at `packages/exxpress-api`, see team for example file
* Include the private NPM token and `export NODE_ENV=development` in your `.bash_profile`
* Install the Facebook SDK https://developers.facebook.com/docs/ios/
* Workaround for Facebook SDK (v4.21.0) requires that the path to repo is two levels in dir structure. If FacebookSDK is in `~/Documents/FacebookSDK` then HT repo should be in `~/Sites/Hero Traveler/hero-traveler-monorepo` for example
* Try open ios/HeroTravelerMobile.xcworkspace/ inside `packages/HeroTravelerMobile` and build from Xcode
* Add to `/packages/HeroTravelerMobile/App/Config/` an `Env.js`

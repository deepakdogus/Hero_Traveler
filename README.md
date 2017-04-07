# HERO Traveler project

This is a monorepo containing all HERO Traveler project code.

## Development setup

Install necessary global packages and install/link all projects modules:

```bash
nvm use # this project requires node v7.7.2
npm i -g react-native-cli
npm i
npm run bootstrap
```
Next, start the API project:

```bash
cd packages/express-api
npm run dev
```

Next, start react-native:
```bash
cd packages/HeroTravelerMobile
react-native run-ios # or run-android
```


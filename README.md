# HERO Traveler project

This is a monorepo containing all HERO Traveler project code.

## Project setup

Install necessary global packages and install/link all projects modules:

### Node & NPM

We are hosting several dependencies on our own private npm server, located at https://npm.abeck.io/

First you'll need to contact `andrew at rehashstudio dot com` to enable user registration.
Next create a user with `npm adduser --registry  https://npm.abeck.io`
After registration, we will close any future registrations, as our private npm will be accessible to anyone registered

This project has only been tested on v7.7.2):

```bash
nvm use 7.7.2
npm i -g react-native-cli
npm set registry https://npm.abeck.io/
npm login
npm config set always-auth true
yarn config set registry https://npm.abeck.io
yarn login
yarn install
npm run bootstrap
```


## Setting up various 3rd parties
### 1. M Lab (Set up a dev database)
* Make an account on [mlab](https://mlab.com) & verify email address
* Set up a MongoDB deployment - Click 'Create new'
* Follow the steps, choosing 'Sandbox' and appropriate settings
* Open up your newly created DB
* Click on the `Users` tabs and Create a new user (this will be the DB owner)
* Copy the MongoDB uri, (looks something like `mongodb://<dbuser>:<dbpassword>@ds033186.mlab.com:33186/kat_herotraveler`), fill in the username + pw for your DB owner. Set aside--you will use it later in [ENV set-up](#setting-up-your-env)

### 2. Cloudinary (Image + video storage + management)
* Make an account on [cloudinary](https://cloudinary.com/) & verify email address
* On main page, click gear icon to go to Settings
* Click on the `Uploads` tab + scroll down to `Upload presets` section
* Add an upload preset with these fields set:
```
mode: Unsigned
folder: test
format: jpg
```
* Add another upload preset with these fields set:
```
mode: Unsigned
folder: testVideo
Eager transformations setting --> Add eager transformation --> scroll down to Fetch Format and select M3U8
		--> Add [another] eager transformation --> scroll down to Fetch Format and select MPEG-DASH
Eager Notification URL: `https://06859835.ngrok.io/story/draft/cover-video`(just an example, will need to edit if/when you actually use this)
```
* Once you save your upload presets, you will see their 'names'.  Note these for [ENV set-up](#setting-up-your-env)


## Setting up your ENV
### 1. Shell profile
* First, get your NPM auth token, which you will have after logging into NPM registry, by opening up `~/.npmrc` and copying whatever follows authToken=
* Add `export NPM_TOKEN="{^that}"` to your `.bash_profile`, `.zshrc`, or equivalent for you shell.
* Close and reopen your shell to allow this change to take effect

### 2. packages/express-api .env
* Add a .env file to root of `packages/express-api` and copy over the contents of .env.example
* Fill in MONGODB_URL with the uri we set up earlier
* Fill in CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, which you can get from your [Cloudinary console](https://cloudinary.com/console)
* See a dev to fill in remaining variables

### 3. packages/ht-seed-data
* Add a .env file to the root of this package
* copy over your .env file contents from `packages/express-api`

### 4. packages/web
* open up `src/App/Config/Env.js`
* We will be editing devSettings, NOT prodSettings
* Fill in the cloudinary related fields (`cloudname`, `imagePreset`, `videoPreset`) which we got above and add cloudname to cdnBaseUrl too
* Replace anything that says `matthew` with your name
* See a dev for additional fields

### 5. packages/HeroTravelerMobile
* Create `App/Config/Env.js` and copy contents from the `packages/web` equivalent




## Running the project locally

Start the API project:

```bash
cd packages/express-api
npm run dev
```

To seed
```bash
cd packages/ht-seed-data
npm run seed
```

To run the mobile app, start react-native in a simulator:

```bash
cd packages/HeroTravelerMobile
npm run start:ios
```

To run the web app,

```bash
cd packages/web
npm run share:watch
```
In a separate window
```bash
npm run start
```
_Note: Android has been neglected for the v1, and does not work yet._

To run the application in development mode on your phone, open xcode with the following command:

```bash
$ open packages/HeroTravelerMobile/ios/HeroTravelerMobile.xcworkspace
```
## Building app on device
#### Dev Mode
1. xcode --> Edit Scheme --> Make sure it's in debug mode not release mode so that you can access Dev Menu via shake gesture
2. Make sure using ngrok if testing on device because localhost is disabled.  And make sure you use the https version of the ngrok url

#### Building on Mojave with Xcode 10, RN version 0.53

* open .xcodeproj file directly from hero-traveler-monorepo
* Targeting simulator will throw this error: `Build input file cannot be found: '/Users/qinguan/Desktop/reactnative/CodeCollab/node_modules/react-native/Libraries/WebSocket/libfishhook.a'`
  * To Fix: copy libfishhook.a from my ios/build/Build/Products/Debug-iphonesimulator/ and paste it into ../node_modules/react-native/Libraries/WebSocket/
* Physical device target will get this error: `No member named '__rip' in '__darwin_arm_thread_state64'`
  * To Fix: follow steps at https://github.com/facebook/react-native/issues/20774
* if you run into a keychain permission dialog error or ‘PhaseScriptExecution’ err, run `brew upgrade carthage` and restart your computer

## Xcode TestFlight Deployment

1. change build number
2. product > archive (have to have target set to physical or generic device)
3. window > organizer
4. add description
5. click upload

## Docker, express-api and deployment

Make sure to set env var `NPM_TOKEN` to the _authToken value you find in `~/.npmrc` after running `npm adduser --registry https://npm.abeck.io` before running `docker-compose build`

These notes from Ryan are presented as is:

```
1. You need access to the npm packages mentioned above (use "npm login" ...)
2. Copy the .env (usually posted in slack channel) to repo root
3. Build with docker-compose
4. Push image to dockerhub
5. Connect to swarm through docker app
6. Deploy with the "docker stack deploy" command (e.g. docker stack deploy --with-registry-auth --compose-file=docker-compose.yaml api)
7. Verify the nodes are starting the app with "docker service ls" and "docker service ps service_name"
```

We currently use docker swarm on AWS with 3 workers running t3.medium and 1 controller running on t3.micro

## Development troubleshooting tips (please read)

* **Uninstalling packages** If you need to uninstall a package with native components, make sure you do `react-native unlink {packageName}` and _then_ `yarn remove {packageName}`
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

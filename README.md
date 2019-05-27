# HERO Traveler project

Welcome to our project! This is a monorepo containing all HERO Traveler project code.

## Project structure

A monorepo is a code structure that places all of code belonging to a project ([or even an entire company](https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext)) in a single source-controlled repository.

Each subdirectory of `packages/` is an application or contains a bundle of code that is used by one of those applications.

Applications:

- `cms` [Deprecated]
- `cms-web`
- `express-api` (backend server)
- `HeroTravelerMobile` (the React Native app)
- `web`

Code Bundles:

- Backend
  - `ht-util`: backend utility functions
  - `ht-core`: Mongoose database schemas
  - `ht-seed-data`
- Frontend
  - `shared`: code that can be shared by all frontend applications in the above list, including mobile
  - `sharedWeb`: code shared between `web` and `cms-web`

### Node & NPM

The first step is to install necessary global packages and install/link all projects modules. We have mostly automated this processs, however we are also hosting several dependencies on our own private npm server, located at https://npm.abeck.io.

1. Create a user with `npm adduser --registry  https://npm.abeck.io`

    _Note: the idea from earlier team was to make this private, but it is currently effectively public, any credentials you use will work_

2. [Install `n` npm version manager if you don't have it already](https://github.com/tj/n#installation)

3. Run the below commands to install dependencies across all the different apps in `packages/` via [lerna](https://github.com/lerna/lerna/tree/master/commands/bootstrap#usage)

      _Note: it's possible you'll still need to `yarn` or `npm install` again in the various packages. Try this first if you are getting dependency errors_

```bash
n 7.7.2
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

- Make an account on [mlab](https://mlab.com) & verify email address
- Set up a MongoDB deployment
  - Click 'Create new'
  - Follow the steps, choosing "Sandbox" and appropriate settings
- Click on your newly created database to open Settings
- Click on the `Users` tabs and `Add database user` (this will be the DB owner)
- Copy the MongoDB uri, (looks something like `mongodb://<dbuser>:<dbpassword>@ds033186.mlab.com:33186/ahj_herotraveler`) and set aside you will use it later in [ENV set-up](#setting-up-your-env)

### 2. Cloudinary (Image + video storage + management)

- Make an account on [Cloudinary](https://cloudinary.com/) and verify email address
- On the main page click the gear icon to go to Settings
- Click on the `Uploads` tab + scroll down to `Upload presets` section
- Add an upload preset with these fields set:

    ```md
    mode: Unsigned
    folder: test
    format: jpg
    ```

- Add another upload preset with these fields set:

    ```md
    - Storage and Access tab
      - mode: Unsigned
      - folder: testVideo
    - Upload Manipulations tab
      - Eager transformations setting 1
        - Add eager transformation
        - More options
        - Scroll down to Fetch Format and select M3U8 Playlist (HLS)
      - Eager transformation 2
        - Fetch format: MPEG-DASH
    ```

- Once you save your upload presets, you will see their 'names'. Note these for [ENV set-up](#setting-up-your-env)

### 3. Algolia (Search)

- Follow the email invitation and make an account (request one if you have not already received it)
- Click on `Indices` in the left side bar
- Click on the name to the right of the `Indices >` at the very top of the page to open up search
- Search for and navigate to the pages belonging to each of the prod indices below:
- For each click `Manage Index > Copy` and name the copied index with the convention `[YOUR NAME]_dev_[INDEX TYPE]`, e.g. `ALLEN_DEV_STORIES`.

#### Current Indices

- `prod_USERS`
- `prod_STORIES`
- `prod_GUIDES`
- `prod_CATEGORIES`
- `prod_HASHTAGS`

### 4. Mailchimp (email list subscriptions)

- Create an account on the [Mailchimp](mailchimp.com) site or use an existing one
- Get your API key
  - Click your username in the top right, then account in the dropdown
  - Go to Extra > API keys
  - Create a key and store it for when you [add it to your.env](#setting-up-your-env)
- Get your list id
  - Go to the List tab
  - Create a new list if one was not created for you at sign up and click its name
  - From the individual list view got to Settings > List name and defaults and copy the List ID for populating the `.env`

## Setting up your ENV

### 1. Shell profile

- First, get your NPM auth token, which you will have after logging into NPM registry, by opening up `~/.npmrc` and copying whatever follows authToken=
- Add `export NPM_TOKEN="{YOUR_COPIED_AUTH_TOKEN}"` to your `.bash_profile`, `.zshrc`, or equivalent for you shell.
- Close and reopen your shell to allow this change to take effect

### 2. packages/express-api .env

- Add a .env file to root of `packages/express-api` and copy over the contents of .env.example
- Fill in `MONGODB_URL` with the uri we set up earlier
- Fill in `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`, which you can get from your [Cloudinary console](https://cloudinary.com/console)
- Fill in `MAILCHIMP_API_KEY` and `MAILCHIMP_LIST_ID` with values you got from setting up Mailchimp
- See a dev to fill in remaining variables

### 3. packages/ht-seed-data

- Add a .env file to the root of this package
- copy over the .env file contents you just created in `packages/express-api`

### 4. packages/web

Our web environment works using Create React App's built in `REACT_APP_` environment variable functionality, with our production values stored on Heroku and populated at build time.

For development purposes:

Running the app with `npm run start` will set `process.env.NODE_ENV` to `development`, causing CRA to draw variables from `.env.development`:

- create `.env.development` at the root of `packages/web` and copy over `.env.example`
- Fill in the Cloudinary and Algolia related fields for which you have values
- See a dev for the remaining fields

### 5. packages/HeroTravelerMobile

- Create `App/Config/Env.js` and copy contents from `./Config/Env.example.js`
- copy values over from `packages/web` equivalents
- See a dev for the prodSettings object

## Running the project locally

### Start the API project:

```bash
cd packages/express-api
npm run dev
```

### Create Seed Data

```bash
cd packages/ht-seed-data
npm run seed
```

### Mobile

To run the app, we must copy the most recent files in `shared` to the `HeroTravelerMobile` package...

```bash
cd packages/HeroTravelerMobile
npm run share:watch
```

...then start react-native in a simulator:

```bash
cd packages/HeroTravelerMobile
npm run start:ios
```

Alternatively, you can open the `.xcworkspace` in Xcode and start the simulator there:

```bash
open packages/HeroTravelerMobile/ios/HeroTravelerMobile.xcworkspace
```

_Note: Android has been neglected for the v1, and does not work yet._

### Web

To run the web app, we must first copy over the latest changes to `shared` and `sharedWeb`

```bash
cd packages/web
npm run share:watch
```

...then a separate terminal tab, run

```bash
npm run start
```

## Building app on device

### Dev Mode

1. Xcode
  - Go to Product > Scheme> Edit Scheme
  - Make sure it's in `Debug` mode not `Release` mode so that you can access Dev Menu via shake gesture

2. Make sure using ngrok if testing on device because localhost is disabled.  And make sure you use the https version of the ngrok url

### Building on Mojave with Xcode 10.1, RN version 0.53

- Open .xcodeproj file directly from hero-traveler-monorepo
- Targeting simulator will throw this error: `Build input file cannot be found: '.../node_modules/react-native/Libraries/WebSocket/libfishhook.a'`
  - To Fix: copy libfishhook.a from my ios/build/Build/Products/Debug-iphonesimulator/ and paste it into ../node_modules/react-native/Libraries/WebSocket/
- If `AVUtilities.swift` is missing, you will need to create the file with that name at the specified path and then copy over the [old file from Github](https://raw.githubusercontent.com/shahen94/react-native-video-processing/224f63cc18baf67d6d5d37e46ec9da16821ea76d/ios/RNVideoProcessing/RNVideoTrimmer/AVUtilities.swift)
- If when targeting a physical device you get the error `No member named '__rip' in '__darwin_arm_thread_state64'` follow the steps [here](https://github.com/facebook/react-native/issues/20774)

## Xcode TestFlight Deployment

1. Change version/build number (version must be greater than last published app version, increment build number by 1)
2. Set Product > Scheme > Edit Scheme to `Release`
3. Product > Archive (have to have target set to physical or generic device)
4. Window > Organizer
5. Click Distribute App

## Docker, express-api and deployment

Make sure to set env var `NPM_TOKEN` to the _authToken value you find in `~/.npmrc` after running `npm adduser --registry https://npm.abeck.io` before running `docker-compose build`

We currently use docker swarm on AWS with 3 workers running t3.medium and 1 controller running on t3.micro

See a dev for `docker-deploy.rtf` and `deployment-process.rtf` and store them on your computer in a directory outside of this repo

## Development troubleshooting tips (please read)

- **Uninstalling packages** If you need to uninstall a package with native components, make sure you do `react-native unlink {packageName}` and _then_ `yarn remove {packageName}`
- Always keep the React Native **debug browser window visible and in its own tab**. Otherwise, the application will sometimes not startup (it'll get stuck on the splash screen) or it will get stuck on the launch screen's picture (the night sky image). If this happens, close the app or refresh the window (respectively) after moving the debug window to the foreground
- Always close Xcode, react-native packager, and simulator before moving to a new branch, or updating an existing branch
- If you are on a clean branch and the application crashes before getting to the launch screen, use Xcode to debug the problem
- If you are on a clean branch and get errors after the splash screen, try to run `npm run newclear` which will reset caches, temporary iOS builds, etc.
- We use redux-persist to persist the redux store on the user's device. You may sometimes need to clear this storage during development or testing. To do so, select Hardware > Erase all Content and Settings in the Simulator menu

### Deprecated troubleshooting

- [Install the Facebook SDK](https://developers.facebook.com/docs/ios)
- Workaround for Facebook SDK (v4.21.0) requires that the path to repo is two levels in dir structure. If FacebookSDK is in `~/Documents/FacebookSDK` then HT repo should be in `~/Sites/Hero Traveler/hero-traveler-monorepo` for example

import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk'

export function loginToFacebook () {
  return new Promise((resolve, reject) => {
    LoginManager.logInWithReadPermissions([
      'public_profile',
      'email',
      'user_friends'
    ]).then(
      (result) => {
        if(result.isCancelled) {
          reject(result);
        } else {
          resolve(result);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function logoutOfFacebook () {
  return LoginManager.logOut()
}

export function getFacebookUserInfo () {
  return new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: 'email,about,name,picture.type(large)'
          }
        }
      },
      (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  })
}

export function loginToFacebookAndGetUserInfo() {
  return new Promise((resolve, reject) => {
    loginToFacebook().then((/*loginResponse*/) => {
      getFacebookUserInfo().then((userResponse) => {
        resolve(userResponse);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}
/*global FB*/

export const loginToFacebookAndGetUserInfo = () => {
  FB.logout()
  return new Promise((resolve, reject) => {
    FB.login((res) => {
      if(res.authResponse) {
        FB.api('/me',
        {
          fields: 'email,about,name,picture.type(large)'
        },
        (res) => {
          if(!res || res.error) {
            reject(res)
          } else {
            resolve(res)
          }
        })
      }
    })
  })
}

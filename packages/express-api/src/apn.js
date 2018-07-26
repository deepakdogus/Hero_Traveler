import AWS from 'aws-sdk'
import path from 'path'
import util from 'util'
import _ from 'lodash'
import {Models} from '@hero/ht-core'

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const arn = process.env.AWS_ARN;

// ----------------------------------------------------------------------------
// Push Types
// ----------------------------------------------------------------------------

export function likeNotification(likedUser, likingUser, story) {
  const notification = {
    title: `You've got a like!`,
    body: `${likingUser.profile.fullName} liked your story ${story.title}`,
    category: 'follower',
    params: story._id,
  }

  return send(likedUser, notification).then(result => {
    return Promise.resolve()
  })
}

export function followerNotification(followedUser, followingUser) {
  const notification = {
    title: `You've got a follower!`,
    body: `${followingUser.profile.fullName} is now following you`,
    category: 'follower',
    params: followingUser._id,
  }

  return send(followedUser, notification).then(result => {
    return Promise.resolve()
  })
}

export function commentNotification(author, commentator, story) {
  const notification = {
    title: `You've got a comment!`,
    body: `${commentator.profile.fullName} commented on your story ${story.title}`,
    category: 'comment',
    params: story._id,
  }

  return send(author, notification).then(result => {
    return Promise.resolve()
  })
}

export function guideCommentNotification(author, commentator, guide) {
  const notification = {
    title: `You've got a comment!`,
    body: `${commentator.profile.fullName} commented on your guide ${guide.title}`,
    category: 'comment',
    params: guide.id,
  }

  return send(author, notification).then(result => {
    return Promise.resolve()
  })
}

// ----------------------------------------------------------------------------
// Push Logic
// ----------------------------------------------------------------------------

function getDevicesForUser(user) {
  return new Promise((resolve, reject) => {
    Models.UserDevice.find({user: user._id}).then((devices) => {
      resolve(_.map(devices, 'deviceId'));
    }).catch((err) => {
      reject(err);
    });
  });
}

function getUnreadActivitiesForUser(user) {
  return Models.Activity.count({user: user._id, seen: false});
}

export function prepareNotification(notification) {
  // See https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html
  let applePush = JSON.stringify({
    aps: {
      alert: notification,
      sound: 'default',
      badge: notification.badge
    },
  })

  return JSON.stringify({
    default: notification.body,
    APNS: applePush,
    APNS_SANDBOX: applePush,
  });
}

function sendOne(device, preparedNotification) {
  // In this function we don't want to reject an attempt, as in the batch function
  // below we're collecting the results and act on them only after we've collected
  // the status on all the devices.
  return new Promise((resolve, reject) => {
    const sns = new AWS.SNS();
    // Before every request we ensure the we've registered this device on the SNS.
    // This is a noop if the device already exists.
    sns.createPlatformEndpoint({
      PlatformApplicationArn: arn,
      Token: device
    }, (err, data) => {
      if (err) {
        // This may only happen if the token is completely invalid i.e. not passing
        // validation from SNS
        resolve({failed: true, payload: err});
      } else {
        sns.publish({
          Message: preparedNotification,
          MessageStructure: 'json',
          TargetArn: data.EndpointArn
        }, (err, data) => {
          if (err) {
            // If this is the first push to the device, SNS always returns a success.
            // If the push doesn't get sent for some reason, the endpoint is disabled
            // and we'll receive an "Endpoint Disabled" error on subsequent tries.
            resolve({failed: true, device, payload: err});
          } else {
            // This merely means that SNS acknowledged our request and put it to queue.
            // It is not a guarantee that the push is received.
            resolve({failed: false, device, payload: data});
          }
        });
      }
    })
  });
}

export function send(user, notification) {
  return new Promise((resolve, reject) => {
    getDevicesForUser(user).then((devices) => {
      getUnreadActivitiesForUser(user).then((activityCount) => {
        // We have to wait for the activity count to supply the
        // badge count to the notification object
        notification.badge = activityCount;
        let preparedNotification = prepareNotification(notification);

        Promise.all(
          // Create an array of requests, each of which are promises.
          _.map(devices, (device) => {
            // This is where we actually send the push.
            return sendOne(device, preparedNotification);
          })
        ).then((results) => {
          // Each request resolves even if it resulted with an error.
          // Collect the failed ones in an array to be removed.
          let fails = _.filter(results, (result) => {
            return result.failed ? result.device : null;
          });
          let devicesToRemove = _.map(fails, fail => fail.device);

          // Now it's time to remove the failed device ids.
          Models.UserDevice.remove({
            deviceId: {
              $in: devicesToRemove
            }
          }).then(() => {
            resolve();
          }).catch((err) => {
            console.error("Device removal error", err)
            reject(err);
          });
        }).catch((err) => {
          console.error("Batch send error", err)
          reject(err);
        })
      }).catch((err) => {
        console.error("Get notification count error", err)
        reject(err);
      })
    }).catch((err) => {
      console.error("Get device error", err)
      reject(err);
    })
  })
}


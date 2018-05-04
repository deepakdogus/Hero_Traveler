import AWS from 'aws-sdk'
import path from 'path'
import util from 'util'
import _ from 'lodash'
import {Models} from '@hero/ht-core'
const sound = 'chime.caf'
const badge = 1

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const arn = process.env.AWS_ARN;

function getDeviceIds(devices) {
  return _.map(devices, 'deviceId')
}

export function constructNotification(title, body, badge) {
  // See https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html
  return {
    default: body,
    APNS: {
      aps: {
        alert: {
          title, body, badge
        },
        sound: 'default',
        badge: 1,
        url: 'hero-traveler://test'
      }
    }
  };
}

export function likeNotification(devices, user, story) {
  const notification = constructNotification(
    `You've got a like!`,
    `${user.profile.fullName} liked your story ${story.title}`,
    1
  );
  return send(notification, getDeviceIds(devices))
    .then(result => {
      return Promise.resolve()
    })
}

export function followerNotification(devices, followingUser) {
  const notification = constructNotification(
    `You've got a follower!`,
    `${followingUser.profile.fullName} is now following you`,
    1
  );

  return send(notification, getDeviceIds(devices))
    .then(result => {
      return Promise.resolve()
    })
}

export function commentNotification(devices, story, user) {
  const notification = constructNotification(
    `You've got a follower!`,
    `${user.profile.fullName} commented on your story ${story.title}`,
    1
  );

  return send(notification, getDeviceIds(devices))
    .then(result => {
      return Promise.resolve()
    })
}

function sendOne(notification, device) {
  return new Promise((resolve, reject) => {
    const sns = new AWS.SNS();
    sns.createPlatformEndpoint({
      PlatformApplicationArn: arn,
      Token: device
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // first have to stringify the inner APNS object...
        notification.APNS = JSON.stringify(notification.APNS);
        // then have to stringify the entire message payload
        notification = JSON.stringify(notification);
        sns.publish({
          Message: notification,
          MessageStructure: 'json',
          TargetArn: data.EndpointArn
        }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      }
    })
  });
}

export async function send(notification, devices, persistDevicesOnFail) {
  let failed = [];

  await Promise.all(
    _.map(devices, async (device) => {
      let result = await sendOne(notification, device).catch((err) => {
        failed.push(device)
      })
    })
  )

  if (!persistDevicesOnFail) {
    Models.UserDevice.remove({
      deviceId: {
        $in: failed
      }
    })
  }
}
import Promise from 'bluebird'
const Mailchimp = require('mailchimp-api-v3');

const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

export default function subscribeMailchimp(userEmail) {
  return new Promise((resolve, reject) => {
    mailchimp.post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
      email_address : userEmail,
      status : 'subscribed'
    })
    .then(function(results) {
      return resolve(results)
    })
    .catch(function (err) {
      return reject(err)
    })
  })
}


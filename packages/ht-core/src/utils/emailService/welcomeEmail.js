import Promise from 'bluebird'
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const cons = require('consolidate');

const mailer = nodemailer.createTransport(sgTransport({
  auth: {
    api_key : process.env.SENDGRID_API_KEY
  }
}));

function renderTemplate(templateName, context) {
  return new Promise((resolve, reject) => {
    cons.mustache(__dirname + `/templates/${templateName}.handlebars`, context, function(err, html) {
      if (err) return reject(err)
      return resolve(html)
    })
  })
}

export default function sendWelcomeEmail(user) {
  if (process.env.DISABLE_EMAIL) {
    return Promise.resolve({})
  }


  // TO-DO: Add universal linking
  const context = {
    subject: 'Welcome to HERO Traveler!',
    confirmationUrl: `${process.env.API_HOST}/user/redirect-verify-email/${user.emailConfirmationToken}`,
    logoUrl: 'https://s3.amazonaws.com/hero-traveler/assets/ht-logo-white-small.png',
    logoHeight: '50px',
    logoWidth: '246px',
    accentColor: 'blue',
    secondaryColor: '#1a1c21',
    siteName: 'HERO Traveler',
    fullName: user.profile.fullName
  }

  return renderTemplate('newUserTemplate', context)
    .then(html => {
      return new Promise((resolve, reject) => {
        mailer.sendMail({
          to: user.email,
          from: process.env.SENDGRID_FROM_ADDRESS,
          subject: context.subject,
          text: 'HERO Traveler',
          html: html
        }, (err, response) => {
          if (err) return reject(err)
          return resolve(response)
        })
      })
    })
}


import _ from 'lodash'
import Promise from 'bluebird'
import path from 'path'
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

// TO-DO: Add universal linking
export default function resetPasswordEmail(user) {
  const context = {
    subject: 'Link to Reset Your HERO Traveler Password',
    resetPasswordUrl: `${process.env.CORS_ORIGIN}/${user.username}?pt=${user.passwordResetToken}`,
    logoUrl: 'https://s3.amazonaws.com/hero-traveler/assets/ht-logo-white-small.png',
    logoHeight: '50px',
    logoWidth: '246px',
    accentColor: 'blue',
    secondaryColor: '#1a1c21',
    siteName: 'HERO Traveler',
    fullName: user.profile.fullName
  }

  return renderTemplate('resetPasswordTemplate', context)
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


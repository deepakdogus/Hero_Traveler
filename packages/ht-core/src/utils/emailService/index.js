var helper = require('sendgrid').mail;
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var sgTransport = require('nodemailer-sendgrid-transport');
var cons = require('consolidate');


var sendgridConfig = {
  api_key : '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'
}

export default function sendEmail(user) {

const context = {
  subject: "Welcome to Hero Traveler!",
  body: "Thank you for becoming a Hero, " + user.profile.fullName + ", let the adventure begin!",
  logoUrl: '../Images/ht-logo-white.png',
  logoHeight: "40px",
  logoWidth: "120px",
  accentColor: "blue",
  secondaryColor: "grey",
  siteName: "Hero Traveler",
  }

cons.handlebars(__dirname + '/templates/newUserTemplate.handlebars', context, function(err, html){

  if(!err) {
    var send_grid = {
     auth: {
       api_key: sendgridConfig.api_key
     }
   }    
var mailer = nodemailer.createTransport(sgTransport(send_grid));
   var email = {
    to: user.email,
    from: 'andrew.watt@rehashstudio.com',
    subject: 'Welcome to Hero Traveler!',
    text: 'Hero Traveler',
    html: html
  };

  mailer.sendMail(email, function(err, res) {
    if (err) { 
      console.log(err) 
    }
    console.log(res);
  });
}

})

}


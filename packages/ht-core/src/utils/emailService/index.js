var helper = require('sendgrid').mail;
var nodemailer = require('nodemailer');
var handlebars = require('nodemailer-express-handlebars');
var sgTransport = require('nodemailer-sendgrid-transport');

var sendgridConfig = {
  api_key : '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',
  admin : {
    name : "Hero Traveler",
    email : 'james+customerservice@rehashstudio.com'
  },
}

export default function sendEmail(userAttrs, msgSubject, msgContent) {

  console.log("userAttrs: ", userAttrs)

//  var options = {
//      viewEngine: {
//          extname: '.handlebars',
//          layoutsDir: './templates',
//          defaultLayout : 'emailWrapper',
//          // partialsDir : 'views/partials/'
//      },
//      viewPath: './templates',
//      extName: '.handlebars'
//  };

// //using sendgrid as transport, but can use any transport.
//  var send_grid = {
//      auth: {
//          api_key: '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'
//      }
//  }
//  var mailer = nodemailer.createTransport(sgTransport(send_grid));
//  mailer.use('compile', handlebars(options));
//  mailer.sendMail({
//      from: 'test@test.com',
//      to: 'to@to.com',
//      subject: 'Any Subject',
//      template: 'email_body',
//      context: {
//           variable1 : 'value1',
//           variable2 : 'value2'
//      }
//  }, function (error, response) {
//      console.log('mail sent to ' + to);
//      mailer.close();
//  });  

}





// export default function sendEmail(fullname, username, email, msgSubject, msgContent) {

//   var from_email = new helper.Email("andrew.watt@rehashstudio.com")
//   var to_email = new helper.Email(email);
//   var content = new helper.Content("text/plain", msgContent);
//   var mail = new helper.Mail(from_email, msgSubject, to_email, content);

//   var sg = require('sendgrid')(sendgridConfig.api_key);
//   var request = sg.emptyRequest({
//     method: 'POST',
//     path: '/v3/mail/send',
//     body: mail.toJSON()
//   });

//   sg.API(request, function(error, response) {
//     console.log(response.statusCode);
//     console.log(response.body);
//     console.log(response.headers);
//   })
// }



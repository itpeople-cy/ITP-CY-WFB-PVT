'use strict';

let nodemailer = require('nodemailer');
let email = "anticounterfeit.service@gmail.com"
let password = "Itpc@1234"
let transporter = nodemailer.createTransport('smtps://' + email + ':' + password + '@smtp.gmail.com');
let RenderHBS = require('./render-hbs')(__dirname + '/templates');

exports.sendEmail = function (email, activationCode) {
  return new Promise(function (resolve, reject) {
    let options = {
      from: 'Anti-Counterfeit <' + email + '>',
      to: email,
      subject: 'Activate your account',
      text: 'Plain text',
      html: RenderHBS.render('verify-email.hbs', {activationCode})
    };

    transporter.sendMail(options, function (error, info) {
      if (error) return reject(error);
      
      resolve(email);
    });
  });
}


exports.sendCertificateHash = function (email, image) {
  return new Promise(function (resolve, reject) {
    let options = {
      from: 'Anti-Counterfeit <' + email + '>',
      to: email,
      subject: 'Certificate',
      text: "",
      html: RenderHBS.render('send-certificate.hbs'),
      attachments: [
        {
          filename: image,
          path: __dirname + '/'+image,
          cid: 'image'
        }
      ]
    };

    transporter.sendMail(options, function (error, info) {
      if (error) return reject(error);
      
      resolve(email);
    });
  });
}


/**
 * Email sending service
 *
 */
'use strict';
var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
  send: function (message, config, done) {
    config = _.extend({secureConnection: false, port: 587}, config);
    var transport = mailer.createTransport(smtpTransport(config));

    transport.sendMail({
      from: message.sender,
      to: message.receiver,
      subject: message.subject,
      html: message.content
    }, function (err) {
      if (err) {
        return done(err);
      }
      done();
    });
  }
};

'use strict';

module.exports = {
  create: function (req, res) {
    var email = req.body;
    var receivers = email.receivers;
    var send = Promise.promisify(EmailService.send);
    var remains = receivers.length;
    logger.info('sending email to ' + remains + ' receivers');
    Promise.map(receivers, function (receiver) {
      var subject = UtilService.resolveParameterizedString(email.subjectTemplate, receiver);
      var content = UtilService.resolveParameterizedString(email.contentTemplate, receiver);
      if(receiver.success) {
        return;
      }
      return send({
        sender: email.sender,
        receiver: receiver.email,
        subject: subject,
        content: content
      },
      email.connection)
      .then(function () {
        receiver.success = true;
        receiver.error = null;
        remains --;
        logger.info('email sent to ' + receiver.email + ', ' + remains + ' remains');
      }, function (err) {
        remains --;
        logger.warn('error when sending email to ' + receiver.email + ', ' + remains + ' remains. Error: ' + err);
        receiver.error = err.message;
      })
      .delay(2);
    }, {concurrency: 1})
    .then(function () {
      logger.info('all sent');
      res.json(email);
    })
    .catch(function (err) {
      logger.error(err.stack);
      res.status(400).json(err);
    });
  }
};
'use strict';

module.exports = {
  create: function (req, res) {
    var email = req.body;
    var receivers = email.receivers;
    var send = Promise.promisify(EmailService.send);
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
      }, function (err) {
        receiver.error = err.message;
      });
    })
    .then(function () {
      res.json(email);
    })
    .catch(function (err) {
      res.status(400).json(err);
    });
  }
};
'use strict';
module.exports = {
  connections: {
    rabbitmq: {
      options: {
      }
    },
    mongo: {
      hosts: [
        {
          host: '127.0.0.1',
          port: 27017
        }
      ],
      database: 'massEmailTest'
    }
  },
  auth: {
    secret: '2F3755C2-23A4-4BB5-BD4F-D03A3AC5D99A',
    tokenExpiresIn: 7200
  },
  port: 10000
};

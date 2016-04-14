module.exports = {
  connections: {
    mongo: {
      hosts: [
        { host: '127.0.0.1', port: 27017 }
      ],
      database: 'massEmailDev'
    },
  },
  auth: {
    secret: '05096DE7-1AEB-4BB9-93B7-ED5161A14072',
    tokenExpiresIn: 3600 * 8
  },
  port: 10000
};

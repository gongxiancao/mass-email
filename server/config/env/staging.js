module.exports = {
  connections: {
    mongo: {
      hosts: [
        { host: '127.0.0.1', port: 27017 }
      ],
      database: 'massEmailStaging'
    },
  },
  auth: {
    secret: 'C6667C67-3846-49F3-86A2-19A3F001A1EC',
    tokenExpiresIn: 3600 * 8
  },
  paths: {
    public: '../client'
  },
  port: 11111
};

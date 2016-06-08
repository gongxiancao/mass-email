module.exports = {
  connections: {
    mongo: {
      hosts: [
        { host: '10.165.60.202', port: 27017 }
      ],
      database: 'massEmailStaging',
      username: 'massEmailStagingUser',
      password: 'VwsXgwRXYuEt'
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

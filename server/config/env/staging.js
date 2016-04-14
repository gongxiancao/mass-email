module.exports = {
  connections: {
    mongo: {
      hosts: [
        { host: 'mongo1.hangzhou.mass-email.cloudnapps.com', port: 27017 }
      ],
      database: 'massEmailStaging'
    },
  },
  auth: {
    secret: '80E5BF89-BEEC-4561-B05E-8BB4752ED1D2',
    tokenExpiresIn: 3600 * 8
  },
  port: 10000
};

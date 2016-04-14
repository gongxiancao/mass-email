module.exports.policies = {
  '*': ['infra', 'auth'],
  UserController: {
    create: ['infra']
  },
  AuthController: {
    accessToken: ['infra']
  }
};
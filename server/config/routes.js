module.exports.routes = {
  'post /api/v1/auth/access-token': 'AuthController.accessToken',
  'get /api/v1/auth/test': 'AuthController.test',

  'get /api/v1/user/:id': 'UserController.get',
  'post /api/v1/receiver/import': 'ReceiverController.import',

  'post /api/v1/email': 'EmailController.create'
};

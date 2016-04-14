'use strict';
var xlsx = require('node-xlsx');

module.exports = {
  import: function (req, res) {
    if(!req.files || !req.files.file) {
      return res.status(200).json({errcode: 'requireFile', errmsg: 'require uploaded file'});
    }

    var dataSheets = xlsx.parse(req.files.file.path);

    var sheet = dataSheets[0];
    var data = sheet.data;
    var headers = data.shift();

    var fieldIndices = {
      email: -1,
      name: -1
    };

    _.each(headers, function (value, index) {
      fieldIndices[value] = index;
    });
    var result = _.map(data, function (row) {
      return _.mapValues(fieldIndices, function (index) {
        return row[index];
      });
    });

    res.json(result);
  }
};
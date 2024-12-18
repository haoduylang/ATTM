const crypto = require('crypto');

const hashData = (data) => {
  return crypto.createHash('sha1').update(data).digest('hex');
};

module.exports = { hashData };
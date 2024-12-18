const crypto = require('crypto');
const { promisify } = require('util');
const { hashData } = require('./hashUtil'); // Import hashUtil
const generateKeyPair = promisify(crypto.generateKeyPair);

const generateKeyPairAsync = async () => {
  const { publicKey, privateKey } = await generateKeyPair('rsa', {
    modulusLength: 2048, // Đảm bảo kích thước khóa đủ lớn
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  return { publicKey, privateKey };
};

const sign = (data, privateKey) => {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();
  return sign.sign(privateKey, 'base64'); // Sử dụng định dạng base64
};

const verify = (data, signature, publicKey) => {
  const verify = crypto.createVerify('SHA256');
  verify.update(data);
  verify.end();
  return verify.verify(publicKey, signature, 'base64'); // Sử dụng định dạng base64
};

const hashPublicKey = (publicKey) => {
  return hashData(publicKey);
};

module.exports = {
  generateKeyPair: generateKeyPairAsync,
  sign,
  verify,
  hashPublicKey
};
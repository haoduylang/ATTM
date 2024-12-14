const crypto = require('crypto');
const { generateKeyPairSync, createSign, createVerify } = crypto;
const { promisify } = require('util');
const generateKeyPair = promisify(crypto.generateKeyPair);

const generateKeyPairAsync = async () => {
  const { publicKey, privateKey } = await generateKeyPair('rsa', {
    modulusLength: 502,
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
  const sign = createSign('SHA256');
  sign.update(data);
  sign.end();
  return sign.sign(privateKey, 'base64');
};

const verify = (data, signature, publicKey) => {
  const verify = createVerify('SHA256');
  verify.update(data);
  verify.end();
  return verify.verify(publicKey, signature, 'base64');
};

module.exports = {
  generateKeyPair: generateKeyPairAsync,
  sign,
  verify
};
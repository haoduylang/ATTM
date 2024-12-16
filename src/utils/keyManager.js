const crypto = require('crypto');

// Tạo cặp khóa RSA
const generateKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
    });
    return { publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }), privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }) };
};

// Lưu khóa vào database
const saveKeysToDatabase = async (userId, publicKey, privateKey, UserModel) => {
    await UserModel.findByIdAndUpdate(userId, { publicKey, privateKey }, { new: true });
};

module.exports = { generateKeyPair, saveKeysToDatabase };

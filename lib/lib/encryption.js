import JSEncrypt from 'jsencrypt';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';
import CTR from 'crypto-js/mode-ctr';
import NoPadding from 'crypto-js/pad-nopadding';
function generateRandomBytes(byteLength) {
    var result = '';
    while (result.length < byteLength) {
        result += Math.random().toString(36).substr(2, 1);
    }
    return result;
}
function aesEncrypt(plaintext, keyString, ivString, mode, padding) {
    var key = Utf8.parse(keyString);
    var iv = Utf8.parse(ivString);
    var cipherResult = AES.encrypt(plaintext, key, {
        mode: mode,
        padding: padding,
        iv: iv,
    });
    var ciphertext = cipherResult.ciphertext;
    var ciphertextBase64 = ciphertext.toString(Base64);
    return ciphertextBase64;
}
function rsaEncrypt(plaintext, publicKey) {
    var en = new JSEncrypt();
    en.setPublicKey(publicKey);
    var cipher = en.encrypt(plaintext);
    return cipher;
}
/**
 * AES-128-CTR
 */
function ctrEncrypt(plaintext, keyString, ivString) {
    return aesEncrypt(plaintext, keyString, ivString, CTR, NoPadding);
}
export function encryptByRSA(plaintext, publicKey) {
    var iv = generateRandomBytes(16);
    var aesKey = generateRandomBytes(16);
    var cipherText = ctrEncrypt(plaintext, aesKey, iv);
    var secretKey = rsaEncrypt(aesKey, publicKey);
    return {
        cipherText: cipherText,
        iv: iv,
        secretKey: secretKey,
    };
}
//# sourceMappingURL=encryption.js.map
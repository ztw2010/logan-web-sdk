import JSEncrypt from 'jsencrypt'
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'
import CTR from 'crypto-js/mode-ctr'
import NoPadding from 'crypto-js/pad-nopadding'
export interface RSACipherOb {
  cipherText: string
  iv: string
  secretKey: string
}
function generateRandomBytes(byteLength: number): string {
  let result = ''
  while (result.length < byteLength) {
    result += Math.random().toString(36).substr(2, 1)
  }
  return result
}

function aesEncrypt(plaintext: string, keyString: string, ivString: string, mode: any, padding: any): string {
  const key = Utf8.parse(keyString)
  const iv = Utf8.parse(ivString)
  const cipherResult = AES.encrypt(plaintext, key, {
    mode: mode,
    padding: padding,
    iv: iv,
  })
  const ciphertext = cipherResult.ciphertext
  const ciphertextBase64 = ciphertext.toString(Base64)
  return ciphertextBase64
}

function rsaEncrypt(plaintext: string, publicKey: string): string {
  const en = new JSEncrypt()
  en.setPublicKey(publicKey)
  const cipher = en.encrypt(plaintext)
  return cipher
}

/**
 * AES-128-CTR
 */
function ctrEncrypt(plaintext: string, keyString: string, ivString: string): string {
  return aesEncrypt(plaintext, keyString, ivString, CTR, NoPadding)
}

export function encryptByRSA(plaintext: string, publicKey: string): RSACipherOb {
  const iv = generateRandomBytes(16)
  const aesKey = generateRandomBytes(16)
  const cipherText = ctrEncrypt(plaintext, aesKey, iv)
  const secretKey = rsaEncrypt(aesKey, publicKey)
  return {
    cipherText,
    iv,
    secretKey,
  }
}

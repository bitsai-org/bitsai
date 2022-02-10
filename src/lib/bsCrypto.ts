import { Wallet } from './walletUtils'
import CryptoJS from 'crypto-js'

/*
 * These are wrappers around the crypto methods of CryptoJS for use in BitSai
 */

const encryptToString = (msg: string, password: string): string => {
  return CryptoJS.AES.encrypt(
    msg,
    password,
  ).toString()
}

const toSHA256 = (msg: string): string => {
  return CryptoJS.SHA256(msg).toString()
}
const toRIPEMD160 = (msg: string): string => {
  return CryptoJS.RIPEMD160(msg).toString()
}

const decryptWallet = (
  encryptedWallet: string,
  password: string,
): Wallet | undefined => {
  const hashedPassword_SHA256 = toSHA256(password).toString()
  const res = CryptoJS.AES.decrypt(
    encryptedWallet,
    hashedPassword_SHA256,
  )
  try {
    const stringWallet = res.toString(CryptoJS.enc.Utf8)
    const wallet: Wallet = JSON.parse(stringWallet)
    return wallet
  } catch {
    return undefined
  }
}

const decryptMnemonicSeed = (
  encryptedMnemonicSeed: string,
  password: string,
): string | undefined => {
  const hashedPassword_RIPEMD160 = toRIPEMD160(password)
  const res = CryptoJS.AES.decrypt(
    encryptedMnemonicSeed,
    hashedPassword_RIPEMD160,
  )
  try {
    const mnemonicSeed = res.toString(CryptoJS.enc.Utf8)
    if (mnemonicSeed !== '')
      return mnemonicSeed
    else
      return undefined
  } catch {
    return undefined
  }
}

export default {
  encryptToString,
  decryptWallet,
  decryptMnemonicSeed,
  toSHA256,
  toRIPEMD160,
}

import CryptoJS from 'crypto-js'
import {Wallet} from '../lib/walletUtils'

const getEncryptedWallet = (): string | undefined => {
  let encryptedWallet: string | null = localStorage.getItem('encryptedWallet')
  if (encryptedWallet === null)
    return undefined
  else {
    return encryptedWallet
  }
}

const setWallet = (wallet: Wallet) => {
  const encryptedWallet = CryptoJS.AES.encrypt(
    JSON.stringify(wallet),
    wallet.hashedPassword_SHA256,
  ).toString()
  localStorage.setItem('encryptedWallet', encryptedWallet)
}

const persistedWallet = {
  getEncryptedWallet,
  setWallet,
}

export default persistedWallet

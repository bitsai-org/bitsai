import CryptoJS from 'crypto-js'
import {Wallet} from '../lib/walletUtils'

interface EncryptedWallet {
  walletName: string,
  encryptedWallet: string,
}

const getEncryptedWallet = (): string | undefined => {
  const encryptedWallet: string | null = localStorage.getItem('encryptedWallet')
  if (encryptedWallet === null)
    return undefined
  else {
    return encryptedWallet
  }
}

const setWallet = (wallet: Wallet): void => {
  const encryptedWallet = CryptoJS.AES.encrypt(
    JSON.stringify(wallet),
    wallet.hashedPassword_SHA256,
  ).toString()
  localStorage.setItem('encryptedWallet', encryptedWallet)
}

const getEncryptedWallets = (): Array<EncryptedWallet> => {
  const encryptedWalletsString: string | null = localStorage.getItem('encryptedWallets')
  let res: Array<EncryptedWallet> = []
  if (encryptedWalletsString === null) {
    localStorage.setItem(
      'encryptedWallets',
      JSON.stringify([])
    )
    res = []
  } else {
    res = JSON.parse(encryptedWalletsString)
  }
  return res
}

const setWallet_ = (wallet: Wallet): void => {
  const encryptedWalletsString: string | null = localStorage.getItem('encryptedWallets')
  let newEncryptedWallets: Array<EncryptedWallet> = []

  if (encryptedWalletsString !== null)
    newEncryptedWallets = JSON.parse(encryptedWalletsString)

  const newEncryptedWalletString = CryptoJS.AES.encrypt(
    JSON.stringify(wallet),
    wallet.hashedPassword_SHA256,
  ).toString()

  newEncryptedWallets.push({
    walletName: wallet.name,
    encryptedWallet: newEncryptedWalletString
  })

  localStorage.setItem(
    'encryptedWallets',
    JSON.stringify(newEncryptedWallets)
  )
}

const updateWallet = (wallet: Wallet): void => {
  const encryptedWalletsString: string | null = localStorage.getItem('encryptedWallets')
  let encryptedWallets: Array<EncryptedWallet> = []

  if (encryptedWalletsString !== null) {
    encryptedWallets = JSON.parse(encryptedWalletsString)
    const newEncryptedWalletString = CryptoJS.AES.encrypt(
      JSON.stringify(wallet),
      wallet.hashedPassword_SHA256,
    ).toString()
    const i = encryptedWallets.findIndex((item) => item.walletName === wallet.name)
    encryptedWallets[i] = {
      walletName: wallet.name,
      encryptedWallet: newEncryptedWalletString,
    }
    localStorage.setItem(
      'encryptedWallets',
      JSON.stringify(encryptedWallets)
    )
  }

}

const persistedData = {
  getEncryptedWallet,
  setWallet,
  getEncryptedWallets,
  setWallet_,
  updateWallet,
}

export type { EncryptedWallet }
export default persistedData

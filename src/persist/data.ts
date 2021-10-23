import Cookies from 'js-cookie'

const getEncryptedWallet = (): string | undefined => {
  let encryptedWallet: string | undefined = Cookies.get('encryptedWallet')
  if (encryptedWallet === undefined)
    return undefined
  else
    return encryptedWallet
}

const setEncryptedWallet = (encryptedWallet: string) => {
  Cookies.set(
    'encryptedWallet', 
    encryptedWallet,
  )
}

const persistedWallet = {
  getEncryptedWallet,
  setEncryptedWallet,
}

export default persistedWallet

const getEncryptedWallet = (): string | undefined => {
  let encryptedWallet: string | null = localStorage.getItem('encryptedWallet')
  if (encryptedWallet === null)
    return undefined
  else {
    return encryptedWallet
  }
}

const setEncryptedWallet = (encryptedWallet: string) => {
  localStorage.setItem('encryptedWallet', encryptedWallet)
}

const persistedWallet = {
  getEncryptedWallet,
  setEncryptedWallet,
}

export default persistedWallet

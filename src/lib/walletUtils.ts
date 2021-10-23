import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'

import CryptoJS from 'crypto-js'
import persistedWallet from '../persist/data'
import {Credentials} from '../components/GenerateWallet/Form'

interface Addresses {
  external: Array<string>,
  change:   Array<string>,
}

interface Wallet {
  name: string,
  encryptedMnemonicSeed: string,
  addresses: Addresses,
}

const persistWallet = (wallet: Wallet, hashedPassword: string) => {
  //encrypt wallet with the hashed password
  const encryptedWallet = CryptoJS.AES.encrypt(
    JSON.stringify(wallet),
    hashedPassword,
  ).toString()
  persistedWallet.setEncryptedWallet(encryptedWallet)
}

const generateWallet = (
  credentials: Credentials,
  mnemonicSeed: string,
  encryptedMnemonicSeed: string,
): Wallet => {
  const wallet: Wallet = {
    name: credentials.walletName,
    encryptedMnemonicSeed: encryptedMnemonicSeed,
    addresses: initialiseAddresses(mnemonicSeed),
  }
  return wallet
}

interface AddressInterface {
  bip32Interface: bitcoin.BIP32Interface | undefined,
  ec: bitcoin.ECPairInterface | undefined,
  payment: bitcoin.Payment | undefined,
}
const initEmptyAddressInterface = (): AddressInterface => {
  return {
    bip32Interface: undefined,
    ec: undefined,
    payment: undefined,
  }
}

const initialiseAddresses = (mnemonicSeed: string): Addresses => {
  const addresses: Addresses = {
    external: [],
    change: [],
  }

  let seed = bip39.mnemonicToSeedSync(mnemonicSeed)
  let hdNode = bitcoin.bip32.fromSeed(seed)

  const external: AddressInterface = initEmptyAddressInterface()
  const change:   AddressInterface = initEmptyAddressInterface()

  for (let i = 0; i < 20; i++) {
    external.bip32Interface = hdNode.derivePath(`m/44'/0'/0'/0/${i}`)
    change.bip32Interface   = hdNode.derivePath(`m/44'/0'/0'/1/${i}`)

    external.ec = bitcoin.ECPair.fromWIF(
      external.bip32Interface.toWIF()
    )
    change.ec = bitcoin.ECPair.fromWIF(
      change.bip32Interface.toWIF()
    )
    external.payment = bitcoin.payments.p2wpkh({
      pubkey: external.ec.publicKey,
      network: bitcoin.networks.bitcoin,
    })
    change.payment = bitcoin.payments.p2wpkh({
      pubkey: change.ec.publicKey,
      network: bitcoin.networks.bitcoin,
    })

    if (external.payment.address && change.payment.address) {
      addresses.external.push(external.payment.address)
      addresses.change.push(change.payment.address)
    }
  }
  return addresses
}


const walletUtils = {
  persistWallet,
  generateWallet,
}

export type {Wallet, Addresses}
export default walletUtils

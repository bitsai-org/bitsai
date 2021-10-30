import CryptoJS from 'crypto-js'
import axios from 'axios'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'

import auth from '../persist/auth'
import store, {authActions, walletActions} from '../store/store'
import persistedWallet from '../persist/data'
import {Credentials} from '../components/GenerateWallet/Form'

const bip32 = bitcoin.bip32
const NETWORK = bitcoin.networks.regtest
const BLOCKSTREAM_URL = 'http://localhost:3000'
const GAP_LIMIT = 20


interface UnusedAddress {
  segwitAddress: string,
  index: number,
}
interface UnusedAddresses {
  external: Array<UnusedAddress>,
  change:   Array<UnusedAddress>,
}

interface Address {
  segwitAddress: string,
  utxos: Array<string>,
  balance: number,
  publicKey: string,
}

interface Addresses {
  external: Array<Address>,
  change:   Array<Address>,
}

interface Wallet {
  name: string,
  encryptedMnemonicSeed: string,
  addresses: Addresses,
  unusedAddresses: UnusedAddresses,
  xpub: string,
  hashedPassword_SHA256: string,
}

const persistWallet = (wallet: Wallet, hashedPassword_SHA256: string) => {
  //encrypt wallet with the hashed password
  const encryptedWallet = CryptoJS.AES.encrypt(
    JSON.stringify(wallet),
    hashedPassword_SHA256,
  ).toString()
  persistedWallet.setEncryptedWallet(encryptedWallet)
}

const getXpub = (mnemonicSeed: string): string => {
  const seed = bip39.mnemonicToSeedSync(mnemonicSeed)
  let hdNode = bip32.fromSeed(seed)
  hdNode = hdNode.derivePath(`m/84'/0'/0'`)
  return hdNode.neutered().toBase58()
}

const generateWallet = (
  credentials: Credentials,
  mnemonicSeed: string,
) => {
  /*Use the password hash ripemd160 to encrypt the mnemonic seed and sha256
    to encrypt the whole wallet
  */
  const hashedPassword_SHA256 = CryptoJS.SHA256(credentials.password).toString()
  const hashedPassword_RIPEMD160 = CryptoJS.RIPEMD160(credentials.password).toString()

  const encryptedMnemonicSeed = CryptoJS.AES.encrypt(
      mnemonicSeed,
      hashedPassword_RIPEMD160,
  ).toString()

  const xPub = getXpub(mnemonicSeed)
  const [addresses, unusedAddresses] = initialiseAddresses(xPub)
  const wallet: Wallet = {
    name: credentials.walletName,
    encryptedMnemonicSeed: encryptedMnemonicSeed,
    addresses: addresses,
    unusedAddresses: unusedAddresses,
    xpub: xPub,
    hashedPassword_SHA256: hashedPassword_SHA256,
  }

  walletUtils.persistWallet(wallet, hashedPassword_SHA256)
  auth.authenticate(wallet)
}

interface AddressInterface {
  bip32Interface: bitcoin.BIP32Interface | undefined,
  ec: bitcoin.ECPairInterface | undefined,
  payment: bitcoin.Payment | undefined,
}
const generateNewAddresses = (
  xPub: string,
  from: number,
  quantity: number,
  addressType: 'external' | 'change',
): Array<Address> => {
  const newAddresses: Array<Address> = []

  let addressInterface: AddressInterface = {
    bip32Interface: undefined,
    ec: undefined,
    payment: undefined,
  }

  let hdNode = bip32.fromBase58(xPub)

  let pathNumber = from
  for (let i = 0; i < quantity; i++) {
    if (addressType === 'external')
      addressInterface.bip32Interface = hdNode.derivePath(`0/${pathNumber}`)
    else // addressType === 'change'
      addressInterface.bip32Interface = hdNode.derivePath(`1/${pathNumber}`)

    addressInterface.ec = bitcoin.ECPair.fromPublicKey(
      addressInterface.bip32Interface.publicKey
    )
    addressInterface.payment = bitcoin.payments.p2wpkh({
      pubkey: addressInterface.ec.publicKey,
      network: NETWORK,
    })

    if (addressInterface.payment.address)
      newAddresses.push({
        segwitAddress: addressInterface.payment.address,
        publicKey: addressInterface.ec.publicKey.toString('hex'),
        balance: 0,
        utxos: [],
      })

    pathNumber++
  }
  return newAddresses
}

const initialiseAddresses = (xPub: string): [Addresses, UnusedAddresses] => {
  const addresses: Addresses = {
    external: generateNewAddresses(xPub, 0, 20, 'external'),
    change:   generateNewAddresses(xPub, 0, 20, 'change'),
  }
  const unusedAddresses: UnusedAddresses = {
    external: [],
    change: [],
  }

  for (let i = 0; i < addresses.external.length; i++)
    unusedAddresses.external.push({
      segwitAddress: addresses.external[i].segwitAddress,
      index: i,
    })

  for (let i = 0; i < addresses.external.length; i++)
    unusedAddresses.change.push({
      segwitAddress: addresses.change[i].segwitAddress,
      index: i,
    })

  return [addresses, unusedAddresses]
}

const getUtxos = async (segwitAddress: string): Promise<any> => {
  try {
    let utxos = await axios.get(
      `${BLOCKSTREAM_URL}/address/${segwitAddress}/utxo`
    )
    return utxos.data
  } catch(err) {
    console.error(err)
  }
}

const getBalanceFromUtxo = (utxos: Array<any>): number => {
  let sats = 0;
  if (utxos.length !== 0)
    for (const utxo of utxos)
      sats += utxo.value
  return sats
}

const discoverAddresses = async (
  addresses: Array<Address>,
  addressType: 'external' | 'change',
  xPub: string,
): Promise<[Array<Address>, Array<UnusedAddress>]> => {
  try {
    let mutAddresses = [...addresses]
    let resAddresses: Array<Address> = []
    let unusedAddresseses: Array<UnusedAddress> = []
    let successiveUnusedCount = 0

    let i = 0
    while (successiveUnusedCount < GAP_LIMIT ) {
      while (i < mutAddresses.length) {
        console.log('i', i)
        let address = mutAddresses[i]

        let utxos = await getUtxos(address.segwitAddress)
        console.log("address", JSON.stringify(address))
        console.log("utxos", JSON.stringify(utxos))
        if (utxos.length === 0) {
          console.log('No utxo')
          successiveUnusedCount += 1
          unusedAddresseses.push({
            segwitAddress: address.segwitAddress,
            index: i,
          })
        } else {
          console.log('yes utxo')
          successiveUnusedCount = 0
        }
        resAddresses.push({
          segwitAddress: address.segwitAddress,
          publicKey: address.publicKey,
          balance: getBalanceFromUtxo(utxos),
          utxos: utxos,
        })
        i++
        console.log('succ', successiveUnusedCount)
      }
      if (successiveUnusedCount < GAP_LIMIT) {
        const newAddressesCount = GAP_LIMIT - successiveUnusedCount
        const newAddresses = generateNewAddresses(xPub, i, newAddressesCount, addressType)
        mutAddresses = [...resAddresses, ...newAddresses]
        console.log('newAddressesCount', newAddressesCount)
        console.log(JSON.stringify(newAddresses))
        console.log(JSON.stringify(mutAddresses))
      }
    }
    return [
      resAddresses,
      unusedAddresseses,
    ]
  } catch(err) {
    console.error(err)
    throw 'Discover addresses error'
  }
}

const syncWallet = async () => {
  let wallet = store.getState().walletSlice.wallet
  let syncedAddresses: Addresses = {
    external: [],
    change: [],
  }
  let syncedUnusedAddresses: UnusedAddresses = {
    external: [],
    change: [],
  }

  ;[
    syncedAddresses.external,
    syncedUnusedAddresses.external,
  ] = await discoverAddresses(
    wallet.addresses.external,
    'external',
    wallet.xpub,
  )
  ;[
    syncedAddresses.change,
    syncedUnusedAddresses.change,
  ] = await discoverAddresses(
    wallet.addresses.change,
    'change',
    wallet.xpub,
  )

  store.dispatch(
    walletActions.setAddresses({
      addresses: syncedAddresses
    })
  )
  store.dispatch(
    walletActions.setUnusedAddresseses({
      unusedAddresseses: syncedUnusedAddresses
    })
  )

  //update the wallet
  wallet = store.getState().walletSlice.wallet

  const encryptedWallet = CryptoJS.AES.encrypt(
    JSON.stringify(wallet),
    wallet.hashedPassword_SHA256,
  )
  persistedWallet.setEncryptedWallet(encryptedWallet.toString())
}

const walletUtils = {
  persistWallet,
  generateWallet,
  syncWallet,
}

export type {Wallet, Addresses}
export default walletUtils

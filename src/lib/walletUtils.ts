import CryptoJS from 'crypto-js'
import axios from 'axios'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'

import auth from '../persist/auth'
import store, {authActions, walletActions} from '../store/store'
import persistedWallet from '../persist/data'
import {Credentials} from '../components/GenerateWallet/GenerateWalletForm'

const bip32 = bitcoin.bip32
const NETWORK = bitcoin.networks.regtest
const BLOCKSTREAM_URL = 'http://localhost:3000'
const GAP_LIMIT = 20


interface Address {
  segwitAddress: string,
  utxos: Array<any>,
  balance: number,
  publicKey: string,
  used: boolean,
}
interface Addresses {
  external: Array<Address>,
  change:   Array<Address>,
}
interface Wallet {
  name: string,
  encryptedMnemonicSeed: string,
  addresses: Addresses,
  transactions: Array<Transaction>
  xpub: string,
  hashedPassword_SHA256: string,
}
interface Transaction {
  time: number | undefined,
  type: 'in' | 'out',
  amount: number,
  status: 'Confirmed' | 'Unconfirmed'
  tx: any,
  from: string,
  to: string,
  txid: string,
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
  const addresses = initialiseAddresses(xPub)
  const wallet: Wallet = {
    name: credentials.walletName,
    encryptedMnemonicSeed: encryptedMnemonicSeed,
    addresses: addresses,
    transactions: [],
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
    else // if addressType === 'change'
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
        used: false,
      })

    pathNumber++
  }
  return newAddresses
}

const initialiseAddresses = (xPub: string): Addresses => {
  const addresses: Addresses = {
    external: generateNewAddresses(xPub, 0, 20, 'external'),
    change:   generateNewAddresses(xPub, 0, 20, 'change'),
  }

  return addresses
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

const getBalanceFromUtxos = (utxos: Array<any>): number => {
  let sats = 0;
  if (utxos.length !== 0)
    for (const utxo of utxos)
      sats += utxo.value
  return sats
}

const getBalanceTotal = (addresses: Addresses): number => {
  let sats = 0;
  for (const address of addresses.external)
    sats += getBalanceFromUtxos(address.utxos)
  for (const address of addresses.change)
    sats += getBalanceFromUtxos(address.utxos)
  return sats
}

const discoverAddresses = async (
  addresses: Array<Address>,
  addressType: 'external' | 'change',
  xPub: string,
): Promise<[Array<Address>, Array<Transaction>]> => {
  try {
    let clonedAddresses = [...addresses]
    let resAddresses: Array<Address> = []
    let transactions: Array<Transaction> = []
    let successiveUnusedCount = 0

    let i = 0
    while (successiveUnusedCount < GAP_LIMIT ) {
      while (i < clonedAddresses.length) {
        //console.log('i', i)
        const address = clonedAddresses[i]

        const utxos = await getUtxos(address.segwitAddress)
        const addressTransactions = await getTransactionsFromAddress(address.segwitAddress)
        let addressIsUsed: boolean

        //console.log("address", JSON.stringify(address))
        //console.log("utxos", JSON.stringify(utxos))
        if (addressTransactions.length === 0) {
          //console.log('No utxo')
          successiveUnusedCount += 1
          addressIsUsed = false
        } else {
          //console.log('yes utxo')
          addressIsUsed = true
          successiveUnusedCount = 0
        }
        resAddresses.push({
          segwitAddress: address.segwitAddress,
          publicKey: address.publicKey,
          balance: getBalanceFromUtxos(utxos),
          utxos: utxos,
          used: addressIsUsed,
        })
        for (const addressTransaction of addressTransactions)
          transactions.push(addressTransaction)

        i++
        //console.log('succ', successiveUnusedCount)
      }
      if (successiveUnusedCount < GAP_LIMIT) {
        const newAddressesCount = GAP_LIMIT - successiveUnusedCount
        const newAddresses = generateNewAddresses(xPub, i, newAddressesCount, addressType)
        clonedAddresses = [...resAddresses, ...newAddresses]
        //console.log('newAddressesCount', newAddressesCount)
        //console.log(JSON.stringify(newAddresses))
        //console.log(JSON.stringify(mutAddresses))
      }
    }
    return [resAddresses, transactions]
  } catch(err) {
    console.error(err)
    throw 'Discover addresses error'
  }
}


const getTransaction = (segwitAddress: string, tx: any): Transaction => {
  let transaction: Transaction = {
    time: undefined,
    type: 'in',
    status: 'Unconfirmed',
    amount: 0,
    tx: undefined,
    txid: '',
    from: '',
    to: '',
  }

  if (tx.vin.length > 1)
    throw 'Error transaction type is not 1 to many'

  //transaction.tx = tx
  transaction.txid = tx.txid

  if (tx.vin[0].prevout.scriptpubkey_address === segwitAddress) {
    transaction.type = 'out'
    transaction.from = segwitAddress
    transaction.to   = tx.vout[tx.vin[0].vout].scriptpubkey_address
  } else {
    transaction.type = 'in'
    transaction.from = tx.vin[0].prevout.scriptpubkey_address
    transaction.to   = segwitAddress
  }

  if (tx.status.confirmed) {
    transaction.status = 'Confirmed'
    transaction.time   = tx.status.block_time
  } else {
    transaction.status = 'Unconfirmed'
    transaction.time   = undefined
  }
  if (transaction.type === 'out')
    transaction.amount = tx.vout[tx.vin[0].vout].value + tx.fee
  else if (transaction.type === 'in')
    for (const voutItem of tx.vout)
      if (voutItem.scriptpubkey_address === segwitAddress)
        transaction.amount += voutItem.value
  return transaction
}

const getTransactionsFromAddress = async (
  segwitAddress:string
): Promise<Array<Transaction>> => {
  try {
    let transactions: Array<Transaction> = []

    const txs: any = await axios.get(
      `${BLOCKSTREAM_URL}/address/${segwitAddress}/txs`
    )

    for (const tx of txs.data) {
      const transaction = getTransaction(segwitAddress, tx)
      transactions.push(transaction)
    }
    return transactions
  } catch(err) {
    console.error(err)
    throw 'error getting transaction from address'
  }
}

const syncWallet = async () => {
  let wallet = store.getState().walletSlice.wallet
  let syncedAddresses: Addresses = {
    external: [],
    change: [],
  }
  let externalTransactions, changeTransactions

  ;[syncedAddresses.external, externalTransactions] = await discoverAddresses(
    wallet.addresses.external,
    'external',
    wallet.xpub,
  )

  ;[syncedAddresses.change, changeTransactions] = await discoverAddresses(
    wallet.addresses.change,
    'change',
    wallet.xpub,
  )

  const transactions = [...externalTransactions, ...changeTransactions]

  store.dispatch(
    walletActions.setAddresses({
      addresses: syncedAddresses
    })
  )
  store.dispatch(
    walletActions.setTransctions({
      transactions: transactions
    })
  )

  //update the wallet
  wallet = store.getState().walletSlice.wallet

  const encryptedWallet = CryptoJS.AES.encrypt(
    JSON.stringify(wallet),
    wallet.hashedPassword_SHA256,
  )
  persistedWallet.setEncryptedWallet(encryptedWallet.toString())
  auth.setAuthWallet(wallet)
}

interface AddressBalance {
  segwitAddress: string,
  index: number,
  balance: number,
  type: 'external' | 'change',
}
const getAddressesBalances = (addresses: Addresses): Array<AddressBalance> => {
  let addressesBalances: Array<AddressBalance> = []

  let i = 0;
  for (const address of addresses.external) {
    if (address.balance > 0)
      addressesBalances.push({
        segwitAddress: address.segwitAddress,
        index: i,
        balance: address.balance,
        type: 'external',
      })
    i++
  }

  i = 0;
  for (const address of addresses.change) {
    if (address.balance > 0)
      addressesBalances.push({
        segwitAddress: address.segwitAddress,
        index: i,
        balance: address.balance,
        type: 'change',
      })
    i++
  }

  return addressesBalances
}

const walletUtils = {
  persistWallet,
  generateWallet,
  syncWallet,
  getBalanceTotal,
  getAddressesBalances,
}

export type {
  Wallet,
  Address,
  Addresses,
  Transaction,
  AddressBalance,
}

export default walletUtils

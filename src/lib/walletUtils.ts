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
//const BLOCKSTREAM_URL = 'http://localhost:3000'
const BLOCKSTREAM_URL = 'http://192.168.1.236:3000'
//const NETWORK = bitcoin.networks.testnet
//const BLOCKSTREAM_URL = 'https://blockstream.info/testnet/api'
const GAP_LIMIT = 20
const DERIVATION_PATH = `m/84'/0'/0'`

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
  balance: number,
}
interface Transaction {
  time: number | undefined,
  type: 'in' | 'out',
  amount: number,
  status: 'Confirmed' | 'Unconfirmed'
  tx: any,
  txid: string,
}

const decryptWallet = (
  encryptedWallet: string,
  password: string,
): Wallet | undefined => {
  const hashedPassword_SHA256 = CryptoJS.SHA256(password).toString()
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
  const hashedPassword_RIPEMD160 = CryptoJS.RIPEMD160(password).toString()
  try {
    const mnemonicSeed = CryptoJS.AES.decrypt(
      encryptedMnemonicSeed,
      hashedPassword_RIPEMD160,
    ).toString(CryptoJS.enc.Utf8)
    if (mnemonicSeed !== '')
      return mnemonicSeed
    else
      return undefined
  } catch {
    return undefined
  }
}

const getXpub = (mnemonicSeed: string): string => {
  const seed = bip39.mnemonicToSeedSync(mnemonicSeed)
  let hdNode = bip32.fromSeed(seed)
  hdNode = hdNode.derivePath(DERIVATION_PATH)
  return hdNode.neutered().toBase58()
}

const generateWallet = (
  credentials: Credentials,
  mnemonicSeed: string,
) => {
  /*Use the password hash ripemd160 to encrypt the mnemonic seed
    and sha256 to encrypt the whole wallet
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
    balance: 0,
  }

  persistedWallet.setWallet(wallet)
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
    console.log('address')
    return utxos.data
  } catch(err) {
    console.error(err)
  }
}

const getBalanceFromUtxos = (utxos: Array<any>): number => {
  let sats = 0;
  if (utxos.length !== 0)
    for (const utxo of utxos)
      if (utxo.status.confirmed === true)
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

const getTransaction = (
  segwitAddress: string,
  tx: any,
  transactions: Array<Transaction>,
  changeAddresses: Array<Address>,
): Transaction | undefined => {
  //check if transaction is already fetched
  if (transactions.some(transactionElem => transactionElem.txid === tx.txid))
    return undefined

  let transaction: Transaction = {
    time: undefined,
    type: 'in',
    status: 'Unconfirmed',
    amount: 0,
    tx: undefined,
    txid: '',
  }

  transaction.tx = tx
  transaction.txid = tx.txid

  transaction.type = 'in'
  for (const vinElem of tx.vin)
    if (vinElem.prevout.scriptpubkey_address === segwitAddress) {
      transaction.type = 'out'
      break
    }
  for (const voutElem of tx.vout)
    if (voutElem.scriptpubkey_address === segwitAddress) {
      transaction.type = 'in'
      break
    }

  if (tx.status.confirmed) {
    transaction.status = 'Confirmed'
    transaction.time   = tx.status.block_time
  } else {
    transaction.status = 'Unconfirmed'
    transaction.time   = undefined
  }

  if (transaction.type === 'out') {
    for (const voutElem of tx.vout)
      if (!changeAddresses.some(
        (address) => address.segwitAddress === voutElem.scriptpubkey_address)
      )
        transaction.amount += voutElem.value
    transaction.amount += tx.fee
  } else if (transaction.type === 'in') {
    for (const voutElem of tx.vout)
      if (voutElem.scriptpubkey_address === segwitAddress)
        transaction.amount += voutElem.value
  }
  return transaction
}

const getTransactionsFromAddress = async (
  segwitAddress: string,
  transactions: Array<Transaction>,
  changeAddresses: Array<Address>,
): Promise<[Array<Transaction>, number]> => {
  try {
    //shallow copy
    let resTransactions: Array<Transaction> = [...transactions]
    const isAuthenticated = store.getState().authSlice.isAuthenticated
    if (!isAuthenticated)
      throw 'Wallet is no longer authenticated'

    const txs: any = await axios.get(
      `${BLOCKSTREAM_URL}/address/${segwitAddress}/txs`
    )

    const txsCount: number = txs.data.length

    for (const tx of txs.data) {
      const transaction = getTransaction(
        segwitAddress,
        tx,
        resTransactions,
        changeAddresses,
      )
      if (transaction)
        resTransactions.push(transaction)
    }
    return [resTransactions, txsCount]
  } catch(err) {
    console.error(err)
    throw 'error getting transaction from address'
  }
}

const discoverAddresses = async (
  addresses: Array<Address>,
  addressType: 'external' | 'change',
  xPub: string,
  transactions: Array<Transaction>,
  changeAddresses: Array<Address>,
): Promise<[Array<Address>, Array<Transaction>]> => {
  try {
    let resTransactions = [...transactions]
    let clonedAddresses = [...addresses]
    let resAddresses: Array<Address> = []
    let successiveUnusedCount = 0

    let i = 0
    while (successiveUnusedCount < GAP_LIMIT ) {
      while (i < clonedAddresses.length) {
        const address = clonedAddresses[i]

        const utxos = await getUtxos(address.segwitAddress)
        let txsCount: number
        ;[resTransactions, txsCount] = await getTransactionsFromAddress(
          address.segwitAddress,
          resTransactions,
          changeAddresses,
        )
        let addressIsUsed: boolean

        if (txsCount === 0) {
          successiveUnusedCount += 1
          addressIsUsed = false
        } else {
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

        i++
      }
      if (successiveUnusedCount < GAP_LIMIT) {
        const newAddressesCount = GAP_LIMIT - successiveUnusedCount
        const newAddresses = generateNewAddresses(xPub, i, newAddressesCount, addressType)
        clonedAddresses = [...resAddresses, ...newAddresses]
      }
    }
    return [resAddresses, resTransactions]
  } catch(err) {
    console.error(err)
    throw 'Discover addresses error'
  }
}

const syncWallet = async () => {
  try {
    store.dispatch(
      authActions.setWalletIsSyncingTrue()
    )

    console.log('Start syncing')
    let wallet = store.getState().walletSlice.wallet
    let syncedAddresses: Addresses = {
      external: [],
      change: [],
    }
    let transactions: Array<Transaction> = []

    ;[syncedAddresses.external, transactions] = await discoverAddresses(
      wallet.addresses.external,
      'external',
      wallet.xpub,
      [],
      wallet.addresses.change,
    )

    ;[syncedAddresses.change, transactions] = await discoverAddresses(
      wallet.addresses.change,
      'change',
      wallet.xpub,
      transactions,
      wallet.addresses.change,
    )

    const balance = getBalanceTotal(syncedAddresses)

    const isAuthenticated = store.getState().authSlice.isAuthenticated
    if (! isAuthenticated)
      throw 'Wallet is no longer authenticated'

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
    store.dispatch(
      walletActions.setBalance({
        balance: balance
      })
    )

    //update the wallet
    wallet = store.getState().walletSlice.wallet

    persistedWallet.setWallet(wallet)
    auth.setAuthWallet(wallet)
    console.log('End Syncing.')

  } catch(err) {
    console.error(err)
    throw 'Failed syncing wallet'
  } finally {
    store.dispatch(
      authActions.setWalletIsSyncingFalse()
    )
  }
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

const validateAddress = (address: string): boolean => {
  try {
    bitcoin.address.toOutputScript(address, NETWORK)
    return true
  } catch(err) {
    return false
  }
}

const getFirstUnusedAddressIndex = (addresses: Array<Address>): number => {
  let i = 0;
  for (const address of addresses) {
    if (! address.used)
      break
    i++
  }
  return i
}

interface TransactionInput {
  segwitAddress: string,
  utxos: Array<{
    utxo: any,
    scriptPubKey: string,
  }>,
  sender: bitcoin.ECPairInterface,
}

interface InputAddress {
  address: Address,
  index: number,
  type: 'external' | 'change',
}

const estimateTxSize = (nInputs: number, nOutputs: number) => {
  //estimate transaction size in vBytes
  const OVERHEAD = 11
  const INPUTS  = nInputs  * 68
  const OUTPUTS = nOutputs * 31
  return OVERHEAD + INPUTS + OUTPUTS
}

const getScriptPubKeyFromUtxo = (
  utxo: any,
  transactions: Array<Transaction>
): string => {
  let scriptPubKey = ''
  for (const transaction of transactions)
    if (transaction.txid === utxo.txid)
      scriptPubKey = transaction.tx.vout[utxo.vout].scriptpubkey

  if (scriptPubKey === '')
    throw `Error finding the transaction of utxo ${utxo.txid}`
  return scriptPubKey
}

const getInputAddresses = (
  sats: number,
  feeRate: number,
  addresses: Addresses,
): [Array<InputAddress>, number, number, number] => {
  let filledAddresses: Array<InputAddress> = []

  addresses.external.forEach((address, i) => {
    if (address.balance > 0)
      filledAddresses.push({
        address,
        type: 'external',
        index: i,
      })
  })
  addresses.change.forEach((address, i) => {
    if (address.balance > 0)
      filledAddresses.push({
        address,
        type: 'change',
        index: i,
      })
  })

  //sort filled addresses in descending order
  filledAddresses.sort((e1, e2) => e2.address.balance - e1.address.balance)

  //pick which addresses to use in transaction
  //approach used: pick as few utxos as possible using the more rich utxos
  //first then the poor utxos next until the desired Sats are reached
  let inputAddresses:  Array<InputAddress> = []
  let satsPlusFee = sats
  let estimatedTxSize = 0
  let inputsSats = 0
  let fee = 0
  let utxosCount = 0
  for (const filledAddress of filledAddresses) {

    //deep copy
    const inputAddress = JSON.parse(JSON.stringify(
      filledAddress
    ))
    inputAddress.address.utxos = []
    for (const utxo of filledAddress.address.utxos) {
      inputAddress.address.utxos.push(utxo)
      inputsSats += utxo.value
      utxosCount += 1
      if (inputsSats >= satsPlusFee) {

        //estimatedTxSize = estimateTxSize(inputAddresses.length, 2)
        estimatedTxSize = estimateTxSize(utxosCount, 2)
        fee = feeRate * estimatedTxSize
        //rounding the fee because SATOSHIS are the smallest units of exchanges and
        //they cant fractions they must always be integers
        fee = Math.ceil(fee)

        //add fee to sats to check if we need more inputs to cover the newly
        //calculated fee
        //satsPlusFee += fee
        satsPlusFee = sats + fee

        if (inputsSats >= satsPlusFee)
          break
      }
    }
    inputAddresses.push(inputAddress)
  }
  return [inputAddresses, inputsSats, fee, estimatedTxSize]
}

const getTransactionInputs = (
  sats: number,
  feeRate: number,
  addresses: Addresses,
  transactions: Array<Transaction>,
  mnemonicSeed: string,
): [Array<TransactionInput>, number, number, number] => {
  const [
    inputAddresses,
    inputsSats,
    fee,
    estimatedTxSize,
  ] = getInputAddresses(sats, feeRate, addresses)

  let transactionInputs: Array<TransactionInput> = []

  for (const inputAddress of inputAddresses) {
    let resUtxos = []
    for (const utxo of inputAddress.address.utxos)
      resUtxos.push({
        scriptPubKey: getScriptPubKeyFromUtxo(utxo, transactions),
        utxo: utxo,
      })

    const seed = bip39.mnemonicToSeedSync(mnemonicSeed)
    let hdNode = bip32.fromSeed(seed)
    let typeIndex: number
    if (inputAddress.type === 'external')
      typeIndex = 0
    else // if (inputAddress.type === 'change')
      typeIndex = 1

    hdNode = hdNode.derivePath(
      `${DERIVATION_PATH}/${typeIndex}/${inputAddress.index}`
    )

    transactionInputs.push({
      segwitAddress: inputAddress.address.segwitAddress,
      utxos: resUtxos,
      sender: bitcoin.ECPair.fromWIF(hdNode.toWIF())
    })
  }

  return [transactionInputs, inputsSats, fee, estimatedTxSize]
}

const generateTransaction = (
  toAddress: string,
  sats: number,
  feeRate: number,
  wallet: Wallet,
  mnemonicSeed: string,
): [string, number, number] => {
  let psbt = new bitcoin.Psbt({
    'network': NETWORK
  })

  const [
    transactionInputs,
    inputsSats,
    fee,
    estimatedTxSize,
  ] = getTransactionInputs(
    sats,
    feeRate,
    wallet.addresses,
    wallet.transactions,
    mnemonicSeed,
  )

  //add inputs
  for (const transactionInput of transactionInputs)
    for (const utxo of transactionInput.utxos)
      psbt.addInput({
        hash: utxo.utxo.txid,
        index: utxo.utxo.vout,
        witnessUtxo: {
          script: Buffer.from(utxo.scriptPubKey, 'hex'),
          value: utxo.utxo.value,
        },
      })

  //add output
  psbt.addOutput({
    address: toAddress,
    value: sats,
  })

  //send rest inputsSats to an unused change address
  if (sats < inputsSats - fee) {
    const i = getFirstUnusedAddressIndex(wallet.addresses.change)
    const unusedChangeAddress = wallet.addresses.change[i]
    psbt.addOutput({
      address: unusedChangeAddress.segwitAddress,
      value: inputsSats - sats - fee,
    })
  }

  //sign inputs
  let i = 0
  for (const transactionInput of transactionInputs)
    for (const _ of transactionInput.utxos) {
      psbt.signInput(i, transactionInput.sender)
      i++
    }

  if (!psbt.validateSignaturesOfAllInputs())
    throw 'Error: could not validate transaction inputs'

  psbt.finalizeAllInputs()
  const rawTx = psbt.extractTransaction().toHex()
  return [rawTx, fee, estimatedTxSize]
}

const broadcastTransaction = async (rawTx: string): Promise<any> => {
  try {
    const txid = await axios.post(`${BLOCKSTREAM_URL}/tx`, rawTx)
    return txid.data
  } catch(err) {
    console.error(err)
    throw 'Cannot broadcast transaction'
  }
}

//not using it for now
interface BlockstreamFeeEstimate {
  feeRate: number,
  block: number,
}
const getFeeEstimates = async (): Promise<Array<BlockstreamFeeEstimate>> => {
  try {
    const res = await axios.get<Array<any>>(`${BLOCKSTREAM_URL}/fee-estimates`)
    const l = Object.entries(res.data).map(item=> [Number(item[0]), item[1]])
    l.sort((e1, e2) => e1[0] - e2[0])

    const feeEstimates: Array<BlockstreamFeeEstimate> = []
    for (const item of l) {
      feeEstimates.push({
        block: item[0],
        feeRate: item[1],
      })
    }

    return feeEstimates
    //return JSON.parse(feeEstimatesJson)
  } catch(err) {
    console.error(err)
    throw 'failed to get fee estimates'
  }
}

{/*const feeEstimatesJson = `
  [{
      "block": 1,
      "feeRate": 190
  }, {
      "block": 2,
      "feeRate": 180
  }, {
      "block": 3,
      "feeRate": 160
  }, {
      "block": 4,
      "feeRate": 155
  }, {
      "block": 5,
      "feeRate": 144
  }, {
      "block": 6,
      "feeRate": 130
  }, {
      "block": 7,
      "feeRate": 119
  }, {
      "block": 8,
      "feeRate": 108
  }, {
      "block": 9,
      "feeRate": 88
  }, {
      "block": 10,
      "feeRate": 69
  }, {
      "block": 11,
      "feeRate": 55
  }, {
      "block": 12,
      "feeRate": 48
  }, {
      "block": 13,
      "feeRate": 40
  }, {
      "block": 14,
      "feeRate": 33
  }, {
      "block": 15,
      "feeRate": 28
  }, {
      "block": 16,
      "feeRate": 19
  }, {
      "block": 17,
      "feeRate": 15
  }, {
      "block": 18,
      "feeRate": 3
  }, {
      "block": 19,
      "feeRate": 2
  }, {
      "block": 20,
      "feeRate": 1
  }]
`*/}

const walletUtils = {
  generateWallet,
  syncWallet,
  getAddressesBalances,
  validateAddress,
  generateTransaction,
  decryptMnemonicSeed,
  broadcastTransaction,
  getFeeEstimates,
  getInputAddresses,
  decryptWallet,
}

export type {
  Wallet,
  Address,
  Addresses,
  Transaction,
  AddressBalance,
  BlockstreamFeeEstimate as FeeEstimate,
}

export default walletUtils

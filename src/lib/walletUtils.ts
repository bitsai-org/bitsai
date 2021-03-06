import axios from 'axios'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'

import auth from '../persist/auth'
import store, {authActions, walletActions} from '../store/store'
import persistedData from '../persist/data'
import {Credentials} from '../components/GenerateWallet/GenerateWalletForm'
import notification from './notification'
import bsCrypto from './bsCrypto'

const bip32 = bitcoin.bip32
const NETWORK = bitcoin.networks.regtest
const BLOCKSTREAM_URL = 'http://localhost:3000'
const GAP_LIMIT = 20
const DERIVATION_PATH = 'm/84\'/0\'/0\''

interface Address {
  segwitAddress: string,
  utxos: Array<any>,
  balance: Balance,
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
  balance: Balance,
}
interface Balance {
  confirmed: number,
  unconfirmed: number,
}
interface Transaction {
  time: number | undefined,
  type: 'in' | 'out',
  amount: number,
  status: 'Confirmed' | 'Unconfirmed'
  tx: any,
  txid: string,
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
): Wallet => {
  /*Use the password hash ripemd160 to encrypt the mnemonic seed
    and sha256 to encrypt the whole wallet
  */
  const hashedPassword_SHA256 = bsCrypto.toSHA256(credentials.password)
  const hashedPassword_RIPEMD160 = bsCrypto.toRIPEMD160(credentials.password)

  const encryptedMnemonicSeed = bsCrypto.encryptToString(
    mnemonicSeed,
    hashedPassword_RIPEMD160,
  )

  const xPub = getXpub(mnemonicSeed)
  const addresses = initialiseAddresses(xPub)
  const wallet: Wallet = {
    name: credentials.walletName,
    encryptedMnemonicSeed: encryptedMnemonicSeed,
    addresses: addresses,
    transactions: [],
    xpub: xPub,
    hashedPassword_SHA256: hashedPassword_SHA256,
    balance: {confirmed: 0, unconfirmed: 0},
  }

  persistedData.setWallet_(wallet)
  auth.authenticate(wallet)
  return wallet
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

  const addressInterface: AddressInterface = {
    bip32Interface: undefined,
    ec: undefined,
    payment: undefined,
  }

  const hdNode = bip32.fromBase58(xPub)

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
        balance: {confirmed: 0, unconfirmed: 0},
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
    const utxos = await axios.get(
      `${BLOCKSTREAM_URL}/address/${segwitAddress}/utxo`
    )
    console.log('fetched address')
    return utxos.data
  } catch(err) {
    console.error(err)
  }
}

const getBalanceFromUtxos = (utxos: Array<any>): Balance => {
  const balance: Balance = {
    confirmed: 0,
    unconfirmed: 0,
  }
  if (utxos.length !== 0)
    for (const utxo of utxos)
      if (utxo.status.confirmed === true)
        balance.confirmed += utxo.value
      else
        balance.unconfirmed += utxo.value
  return balance
}

const getBalanceTotal = (addresses: Addresses): Balance => {
  const externalBalance: Balance = {
    confirmed: 0,
    unconfirmed: 0,
  }
  const changeBalance: Balance = {
    confirmed: 0,
    unconfirmed: 0,
  }
  for (const address of addresses.external) {
    const balance = getBalanceFromUtxos(address.utxos)
    externalBalance.confirmed   += balance.confirmed
    externalBalance.unconfirmed += balance.unconfirmed
  } for (const address of addresses.change) {
    const balance = getBalanceFromUtxos(address.utxos)
    changeBalance.confirmed   += balance.confirmed
    changeBalance.unconfirmed += balance.unconfirmed
  }
  const balance: Balance = {
    confirmed: externalBalance.confirmed + changeBalance.confirmed,
    unconfirmed: externalBalance.unconfirmed + changeBalance.unconfirmed
  }
  return balance
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

  const transaction: Transaction = {
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
    const resTransactions: Array<Transaction> = [...transactions]
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
    const resAddresses: Array<Address> = []
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

const syncWallet = async (): Promise<void> => {
  try {
    store.dispatch(
      authActions.setWalletIsSyncingTrue()
    )

    console.log('Start syncing')
    notification.setInfo('Syncing wallet...')
    let wallet = store.getState().walletSlice.wallet
    const syncedAddresses: Addresses = {
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
    console.log(wallet)

    persistedData.updateWallet(wallet)
    auth.setAuthWallet(wallet)

    notification.setInfo('Finished syncing wallet!')
    console.log('End Syncing.')

  } catch(err) {
    console.error(err)
    const newError = 'Failed to sync wallet'
    notification.setError(newError)
    throw newError
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
const getAddressesConfirmedBalances = (addresses: Addresses): Array<AddressBalance> => {
  const addressesBalances: Array<AddressBalance> = []

  let i = 0
  for (const address of addresses.external) {
    if (address.balance.confirmed > 0)
      addressesBalances.push({
        segwitAddress: address.segwitAddress,
        index: i,
        balance: address.balance.confirmed,
        type: 'external',
      })
    i++
  }

  i = 0
  for (const address of addresses.change) {
    if (address.balance.confirmed > 0)
      addressesBalances.push({
        segwitAddress: address.segwitAddress,
        index: i,
        balance: address.balance.confirmed,
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
  let i = 0
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
  const filledAddresses: Array<InputAddress> = []

  addresses.external.forEach((address, i) => {
    if (address.balance.confirmed > 0)
      filledAddresses.push({
        address,
        type: 'external',
        index: i,
      })
  })
  addresses.change.forEach((address, i) => {
    if (address.balance.confirmed > 0)
      filledAddresses.push({
        address,
        type: 'change',
        index: i,
      })
  })

  //sort filled addresses in descending order
  filledAddresses.sort((e1, e2) => e2.address.balance.confirmed - e1.address.balance.confirmed)

  //pick which addresses to use in transaction
  //(approach used): pick as few utxos as possible using the more rich utxos
  //first then the poor utxos next until the desired Sats are reached
  const inputAddresses:  Array<InputAddress> = []
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
    if (inputsSats >= satsPlusFee)
      break
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

  const transactionInputs: Array<TransactionInput> = []

  for (const inputAddress of inputAddresses) {
    const resUtxos = []
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
  const psbt = new bitcoin.Psbt({
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
  for (const transactionInput of transactionInputs) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of transactionInput.utxos) {
      psbt.signInput(i, transactionInput.sender)
      i++
    }
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
    notification.setInfo('Transaction broadcasted successfully!')
    return txid.data
  } catch(err) {
    console.error(err)
    const errorMsg = 'Cannot broadcast transaction'
    notification.setError(errorMsg)
    throw errorMsg
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

const walletUtils = {
  generateWallet,
  syncWallet,
  getAddressesBalances: getAddressesConfirmedBalances,
  validateAddress,
  generateTransaction,
  broadcastTransaction,
  getFeeEstimates,
  getInputAddresses,
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

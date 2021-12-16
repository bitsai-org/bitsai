import { createSlice, configureStore } from '@reduxjs/toolkit'
import { Wallet } from '../lib/walletUtils'

const emptyWallet: Wallet = {
  name: '',
  encryptedMnemonicSeed: '',
  addresses: {
    external: [],
    change:   [],
  },
  transactions: [],
  xpub: '',
  hashedPassword_SHA256: '',
  balance: {confirmed: 0, unconfirmed: 0},
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallet: emptyWallet,
  },
  reducers: {
    setWallet(state, actions) {
      state.wallet = actions.payload.wallet
    },
    setAddresses(state, actions) {
      state.wallet.addresses = actions.payload.addresses
    },
    setBalance(state, actions) {
      state.wallet.balance = actions.payload.balance
    },
    setTransctions(state, actions) {
      state.wallet.transactions = actions.payload.transactions
    },
    clearWallet(state) {
      state.wallet = emptyWallet
    },
  },
})

interface AuthSliceTypes {
  isAuthenticated: boolean,
  hashedPassword: string | undefined,
  walletIsSyncing: boolean,
  errorStack: Array<string>,
  infoMsg: string | undefined,
  warningMsg: string | undefined,
}

const authSliceInitialState: AuthSliceTypes = {
  isAuthenticated: false,
  hashedPassword: undefined,
  walletIsSyncing: false,
  errorStack: [],
  infoMsg: undefined,
  warningMsg: undefined,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: authSliceInitialState,
  reducers: {
    authenticate(state) {
      state.isAuthenticated = true
    },
    deAuthenticate(state) {
      state.isAuthenticated = false
      state.hashedPassword = undefined
      state.walletIsSyncing = false
    },
    setHashedPassword(state, actions) {
      state.hashedPassword = actions.payload.hashedPassword
    },

    setWalletIsSyncingTrue(state) {
      state.walletIsSyncing = true
    },
    setWalletIsSyncingFalse(state) {
      state.walletIsSyncing = false
    },

    pushToErrorStack(state, actions) {
      state.errorStack.push(actions.payload.msg)
    },
    cleanErrorStack(state) {
      state.errorStack = []
    },

    setInfoMsg(state, actions) {
      state.infoMsg = actions.payload.msg
    },
    clearInfoMsg(state) {
      state.infoMsg = undefined
    },
    setWarningMsg(state, actions) {
      state.warningMsg = actions.payload.msg
    },
    clearWarningMsg(state) {
      state.warningMsg = undefined
    },
  },
})

const store = configureStore({
  reducer: {
    authSlice: authSlice.reducer,
    walletSlice: walletSlice.reducer,
  },
})

export const walletActions = walletSlice.actions
export const authActions = authSlice.actions
export default store

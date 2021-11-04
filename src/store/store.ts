import { createSlice, configureStore } from '@reduxjs/toolkit'
import {Addresses, Wallet} from '../lib/walletUtils'

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
    setTransctions(state, actions) {
      state.wallet.transactions = actions.payload.transactions
    },
    clearWallet(state) {
      state.wallet = emptyWallet
    },
  },
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    hashedPassword: undefined,
  },
  reducers: {
    authenticate(state) {
      state.isAuthenticated = true
    },
    deAuthenticate(state) {
      state.isAuthenticated = false
    },
    setHashedPassword(state, actions) {
      state.hashedPassword = actions.payload.hashedPassword
    }
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

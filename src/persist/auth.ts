//import {useSelector, useDispatch} from 'react-redux'
import CryptoJS from 'crypto-js'

import {Wallet} from '../lib/walletUtils'
import store, {authActions, walletActions} from '../store/store'

interface Auth {
  isAuthenticated: boolean,
  hashedPassword: string | undefined,
  wallet: Wallet | undefined,
}

const checkAuthentication = () => {
  let res: string | null = sessionStorage.getItem('auth')
  if (res === null) {
    deAuthenticate()
  } else {
    const auth = JSON.parse(res)
    const wallet = auth.wallet
    if (auth.isAuthenticated) {
      if (wallet) {
        store.dispatch(authActions.authenticate())
        store.dispatch(walletActions.setWallet({
          wallet: wallet,
        }))
      }
    }
  }
}

const authenticate = (wallet: Wallet, hashedPassword: string) => {
    const auth: Auth = {
      isAuthenticated: true,
      hashedPassword,
      wallet,
    }
    store.dispatch(authActions.authenticate())

    store.dispatch(walletActions.setWallet({
      wallet: wallet,
    }))

    // persist auth for current session
    sessionStorage.setItem(
      'auth',
      JSON.stringify(auth),
    )
}

const deAuthenticate = () => {
    console.log('ha')
    const auth: Auth = {
      isAuthenticated: false,
      hashedPassword: undefined,
      wallet: undefined,
    }
    sessionStorage.setItem(
      'auth',
      JSON.stringify(auth),
    )

    store.dispatch(authActions.deAuthenticate())
    store.dispatch(walletActions.clearWallet())
}

const auth = {
  authenticate,
  deAuthenticate,
  checkAuthentication,
}

export default auth

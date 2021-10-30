//import {useSelector, useDispatch} from 'react-redux'
import CryptoJS from 'crypto-js'

import {Wallet} from '../lib/walletUtils'
import store, {authActions, walletActions} from '../store/store'

interface Auth {
  isAuthenticated: boolean,
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

const authenticate = (wallet: Wallet) => {
    const auth: Auth = {
      isAuthenticated: true,
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
    const auth: Auth = {
      isAuthenticated: false,
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

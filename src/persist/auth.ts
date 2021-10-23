import Cookies from 'js-cookie'
//import {useSelector, useDispatch} from 'react-redux'
import CryptoJS from 'crypto-js'

import {Wallet} from '../lib/walletUtils'
import store, {authActions, walletActions} from '../store/store'

interface Auth {
  isAuthenticated: boolean,
  wallet: Wallet | undefined,
  hashedPassword: string | undefined,
}

const checkAuthentication = () => {
  let res: string | undefined = Cookies.get('auth')
  let auth: Auth
  if (res === undefined) {
    deAuthenticate()
  } else {
    auth = JSON.parse(res)
    const wallet = auth.wallet
    //const hashedPassword = auth.hashedPassword
    if (auth.isAuthenticated && wallet) {
      store.dispatch(authActions.authenticate())

      //store.dispatch(authActions.setHashedPassword({
        //hashedPassword: hashedPassword,
      //}))
      store.dispatch(walletActions.setWallet({
        wallet: wallet,
      }))
    }

  }
}

const authenticate = (wallet: Wallet, hashedPassword: string) => {
    const auth: Auth = {
      isAuthenticated: true,
      wallet,
      hashedPassword,
    }
    Cookies.set(
      'auth',
      JSON.stringify(auth),
    )
    store.dispatch(authActions.authenticate())

    //store.dispatch(authActions.setHashedPassword({
      //hashedPassword: hashedPassword,
    //}))
    store.dispatch(walletActions.setWallet({
      wallet: wallet,
    }))
    const tmp = CryptoJS.AES.decrypt(
      wallet.encryptedMnemonicSeed,
      hashedPassword,
    ).toString(CryptoJS.enc.Utf8)
    console.log('Mnemonic: ', tmp)
}

const deAuthenticate = () => {
    const auth: Auth = {
      isAuthenticated: false,
      wallet: undefined,
      hashedPassword: undefined,
    }
    Cookies.set(
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

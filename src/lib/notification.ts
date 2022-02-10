import store, { authActions } from '../store/store'

const setError = (msg: string): void => {
  store.dispatch(
    authActions.pushToErrorStack({
      msg: msg,
    })
  )
}

const setInfo = (msg: string): void => {
  store.dispatch(
    authActions.setInfoMsg({
      msg: msg,
    })
  )
}

const setWarning = (msg: string): void => {
  store.dispatch(
    authActions.setWarningMsg({
      msg: msg,
    })
  )
}

export default {
  setInfo,
  setError,
  setWarning,
}

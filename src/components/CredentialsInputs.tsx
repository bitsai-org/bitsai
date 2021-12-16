import React, {useState, useEffect} from 'react'
import { passwordStrength } from 'check-password-strength'

//import styled from '@emotion/styled'
import styled from '@emotion/styled'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import persitedData, {EncryptedWallet} from '../persist/data'

const TextField_ = styled(TextField)`
  width: 100%;
`

interface CredentialsInputsType {
  walletName: string,
  password:   string,
  ok: boolean,
}

interface Props {
  onChange: (
    credentials: CredentialsInputsType,
  ) => void,
}

const CredentialsInputs = (props: Props): JSX.Element => {
  const [walletName, setWalletName] = useState('')
  const [nonExistantWalletName, setNonExistantWalletName] = useState<boolean>(false)


  const [password, setPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const [passwordStrengthValue, setPasswordStrengthValue] = useState('')

  const [credentialsOk, setCredentialsOk] = useState(false)

  const handleWalletName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWalletName = event.target.value

    //replace whitespace by underscores (_) so that in case of someone pasting a
    //walletname containing whitespaces it replace them autimatically with underscores
    const newWalletNameTrimmed = newWalletName.trim().replace(/\s+/g,'_')
    setNonExistantWalletName(
      validateWalletName(newWalletNameTrimmed)
    )
    setWalletName(newWalletNameTrimmed)
    props.onChange({
      walletName: newWalletNameTrimmed,
      password: password,
      ok: credentialsOk,
    })
  }
  const handlePassword  = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value
    setPassword(newPassword)
    setPasswordStrengthValue(passwordStrength(newPassword).value)
    props.onChange({
      walletName: walletName,
      password: newPassword,
      ok: credentialsOk,
    })
  }

  const handleRepeatedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRepeatedPassword = event.target.value
    setRepeatedPassword(newRepeatedPassword)
    if (! password.startsWith(newRepeatedPassword))
      setIncorrectPassword(true)
    else
      setIncorrectPassword(false)
  }

  useEffect(() => {
    let newCredentialsOk = false
    if (
      walletName !== ''
      && password !== ''
      && repeatedPassword !== ''
      && password === repeatedPassword
      && nonExistantWalletName === true
    ) {
      newCredentialsOk = true
    } else {
      newCredentialsOk = false
    }
    setCredentialsOk(newCredentialsOk)
    props.onChange({
      walletName: walletName,
      password: password,
      ok: newCredentialsOk,
    })
  }, [walletName, password, repeatedPassword])

  return (
    <Box
      style={{
        width: '100%',
      }}
    >
      <Box>
        <TextField_
          label="Wallet name"
          variant="filled"
          value={walletName}
          onChange={handleWalletName}

          helperText={!nonExistantWalletName && walletName !== '' ? 'Name already exists.' : ''}
          error={!nonExistantWalletName && walletName !== ''}
        />
      </Box>
      <Box mt="1rem">
        <TextField_
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={handlePassword}
        />
        <Box component="p">
          {passwordStrengthValue}
        </Box>
      </Box>
      <Box mt="1rem">
        <TextField_
          label="Repeat password"
          variant="filled"
          type="password"
          value={repeatedPassword}
          onChange={handleRepeatedPassword}

          helperText={incorrectPassword ? 'Incorrect entry.' : ''}
          error={incorrectPassword}
        />
      </Box>
    </Box>
  )
}

const validateWalletName = (newWalletName: string): boolean => {
  /*
   * always get existing wallet list on each submit so that in case
   * of another persited data change from other app instances we
   * get the updated new wallet list.
   *
   * Although this method is inefficient as it query the data from disk on each
   * change of `newWalletName`, in contrast to just checking one time on submit.
   * Yet it let us have an awesome UX, where if a name is incorrect it tell us
   * on the fly.
   *
   * So in this case ------> UX > Performance
   * :)))))
   */

  const encryptedWallets: Array<EncryptedWallet> = persitedData.getEncryptedWallets()

  let walletNamesList = []
  walletNamesList = encryptedWallets.map(
    (item: EncryptedWallet) => item.walletName
  )

  return ! walletNamesList.includes(newWalletName)
}


export type {CredentialsInputsType}
export default CredentialsInputs

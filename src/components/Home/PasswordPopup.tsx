import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux'
import styled from 'styled-components'

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

import walletUtils from '../../lib/walletUtils'


const TextField_ = styled(TextField)`
  background-color: white;
  width: 20rem;
`

interface Props {
  onSubmit: (mnemonicSeed: string) => void,
  open: boolean
  close: () => void,
}

const PasswordPopup = (props: Props) => {
  const encryptedMnemonicSeed: string = useSelector((state: any) => {
    return state.walletSlice.wallet.encryptedMnemonicSeed
  })

  const [password, setPassword] = useState('')
  const [incorrectPassword, setIncorrectPassword] = useState(false)

  useEffect(() => {
    if (!props.open) {
      setPassword('')
      setIncorrectPassword(false)
    }
  }, [props.open])

  const handleClose = () => {
    props.close()
  }

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    if (incorrectPassword)
      setIncorrectPassword(false)
  }

  const handleSumbit = () => {
    const mnemonicSeed = walletUtils.decryptMnemonicSeed(
      encryptedMnemonicSeed,
      password,
    )
    if (mnemonicSeed === undefined)
      setIncorrectPassword(true)
    else
      props.onSubmit(mnemonicSeed)
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        clone
      >
        <Modal
          open={props.open}
          onClose={handleClose}
          //className={classes.modal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={props.open}>
            <Box
              bgcolor="#a35c20"
              border={2}
              p="0.5rem"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box
                component="h2"
                mb="0.3rem"
              >
                Enter Password
              </Box>
              <TextField_
                label="Password"
                variant="filled"
                type="password"
                value={password}
                onChange={handlePassword}
                helperText={incorrectPassword ? 'Incorrect password.' : ''}
                error={incorrectPassword}
              />
              <Box
                mt="0.6rem"
              >
                <Button
                  variant="contained"
                  onClick={handleSumbit}
                  type="submit"
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </>
  )
}

export default  PasswordPopup

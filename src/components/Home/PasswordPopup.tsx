import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux'
import styled from '@emotion/styled'

import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import walletUtils from '../../lib/walletUtils'


const TextField_ = styled(TextField)`
  background-color: white;
  width: 20rem;
`

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
};

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
        //clone
      >
        <Modal
          open={props.open}
          onClose={handleClose}
          //className={classes.modal}
          closeAfterTransition
          //BackdropComponent={Backdrop}
          //BackdropProps={{
            //timeout: 500,
          //}}
        >
          <Fade in={props.open}>
            <Box
              sx={modalStyle}
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

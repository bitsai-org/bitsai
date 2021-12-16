import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import theme from '../theme'

import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import walletUtils from '../lib/walletUtils'
import MnemonicInfo from './GenerateWallet/MnemonicInfo'

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
}

interface Props {
  onSubmit?: (mnemonicSeed: string) => void,
  open: boolean
  close: () => void,
  after?: 'show-mnemonic-seed',
}

const PasswordPopup = (props: Props): JSX.Element => {
  const encryptedMnemonicSeed: string = useSelector((state: any) => {
    return state.walletSlice.wallet.encryptedMnemonicSeed
  })

  const [password, setPassword] = useState('')
  const [incorrectPassword, setIncorrectPassword] = useState(false)

  const [mnemonicSeed,setMnemonicSeed] = useState<string | undefined>(undefined)
  const [displayMnemonicSeed,setDisplayMnemonicSeed] = useState(false)

  useEffect(() => {
    if (!props.open) {
      //clean
      setPassword('')
      setIncorrectPassword(false)
      setDisplayMnemonicSeed(false)
      setMnemonicSeed(undefined)
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
    const newMnemonicSeed = walletUtils.decryptMnemonicSeed(
      encryptedMnemonicSeed,
      password,
    )
    if (newMnemonicSeed === undefined)
      setIncorrectPassword(true)
    else {
      if (props.after === 'show-mnemonic-seed') {
        setMnemonicSeed(newMnemonicSeed)
        setDisplayMnemonicSeed(true)
      }
      else if (props.onSubmit !== undefined) {
        props.onSubmit(newMnemonicSeed)
      }
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
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
          <Fade in={props.open}
            style={{
              width: '70vw',
              padding: '1rem'
              //height: '30vh',
            }}
          >
            <Box
              sx={modalStyle}
              bgcolor={theme.palette.background.default}
              border={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {!displayMnemonicSeed &&
                <Box
                  p="0.5rem"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: {
                      xs: '100%',
                      lg: '60%',
                    }
                  }}
                >
                  <Box
                    component="h2"
                    mb="0.3rem"
                  >
                    Enter Password
                  </Box>
                  <TextField
                    label="Password"
                    variant="filled"
                    type="password"
                    value={password}
                    onChange={handlePassword}
                    helperText={incorrectPassword ? 'Incorrect password.' : ''}
                    error={incorrectPassword}
                    style={{
                      width: '100%',
                    }}
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
              }
              {displayMnemonicSeed &&
                <MnemonicInfo
                  mnemonicSeed={mnemonicSeed!}
                  option='no-details'
                />
              }
            </Box>
          </Fade>
        </Modal>
      </Box>
    </>
  )
}

export default  PasswordPopup

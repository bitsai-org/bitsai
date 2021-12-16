import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import QRCode from 'qrcode'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import theme from '../theme'

import CopyCpNotification from '../components/Receive/CopyCpNotification'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import styled from '@emotion/styled'
import makeStyles from '@mui/styles/makeStyles'

import Button from '@mui/material/Button'

import {Wallet, Address} from '../lib/walletUtils'

const useStyles = makeStyles({
  input: {
    color: '#ebc19c',
  }
})

const TextField_ = styled(TextField)`
  width: 100%;
  //margin-left: 2rem;
`

const Receive = (): JSX.Element => {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [visibleNotification, setVisibleNotification] = React.useState(false)
  const [generatedAddress, setGeneratedAddress] = useState('')
  const [unusedAddresses, setUnusedAddresses] = useState<Array<Address>>([])
  const [oldUnusedAddressIndex, setOldUnusedAddressIndex] = useState<number | undefined>(undefined)

  const wallet: Wallet = useSelector((state: any) => {
    return state.walletSlice.wallet
  })

  const classes = useStyles()

  const handleClickCopyCp = () => {
    setVisibleNotification(true)
  }

  const generateAddress = (newUnusedAddresses: Array<Address>) => {
    let r = randomInt(0, 19)
    if (oldUnusedAddressIndex !== undefined)
      while (r === oldUnusedAddressIndex)
        r = randomInt(0, 19)
    setOldUnusedAddressIndex(r)
    const unusedAddress = newUnusedAddresses[r].segwitAddress
    setGeneratedAddress(unusedAddress)
    generateQR(unusedAddress)
  }

  const handleCloseNotification = (visibility: boolean) => {
    setVisibleNotification(visibility)
  }

  const generateQR = async (segwitAddress: string) => {
    try {
      const paymentURI = `bitcoin:${segwitAddress}`

      const opts = {
        rendererOpts: {
          quality: 1,
        }
      }
      const url = await QRCode.toDataURL(paymentURI, opts)
      setQrCodeUrl(url)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setUnusedAddresses(
      getUnusedAddresses(wallet.addresses.external)
    )
  }, [wallet.addresses.external])

  useEffect(() => {
    const newUnusedAddresses = getUnusedAddresses(wallet.addresses.external)
    setUnusedAddresses(newUnusedAddresses)
    generateAddress(newUnusedAddresses)
  }, [])

  return (
    <>
      <Box
        mb="2rem"
        display="flex"
        justifyContent="center"
        color={theme.palette.primary.main}
        sx={{
          fontSize: {
            xs: '6vw',
            sm: '2rem',
          }
        }}
      >
        <h2>
          Receive satoshis
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          justifySelf="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          sx={{
            width: {
              xs: '80%',
              sm: '60%',
              md: '40%',
              lg: '30%',
            }
          }}
        >
          <Box
            component="img"
            src={qrCodeUrl}
            alt="qrcode-img"
          />
          <CopyToClipboard
            text={generatedAddress}
          >
            <TextField_
              variant="filled"
              inputProps={{
                readOnly: true,
                className: classes.input,
              }}
              label="Address"
              value={generatedAddress}
              onClick={handleClickCopyCp}
              sx={{
                width: '100%',
                marginTop: '1rem',
              }}
            />
          </CopyToClipboard>

          <CopyCpNotification
            open={visibleNotification}
            onClose={(open)=>{handleCloseNotification(open)}}
          />
          <Box
            mt="1rem"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => {generateAddress(unusedAddresses)}}
            >
              GENERATE
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

const getUnusedAddresses = (addresses: Array<Address>): Array<Address> => {
  const unusedAddresses: Array<Address> = []
  for (const address of addresses)
    if (! address.used)
      unusedAddresses.push(address)
  return unusedAddresses
}

const randomInt= (min: number, max: number): number => {
  // Inclusive random integer
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

export default Receive

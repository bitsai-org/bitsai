import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import QRCode from 'qrcode'

import CopyCpNotification from '../components/Receive/CopyCpNotification'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'

import FileCopyIcon from '@material-ui/icons/FileCopy'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import { makeStyles } from '@material-ui/core/styles'
import {Wallet, Address} from '../lib/walletUtils'

const useStyles = makeStyles({
  input: {
    color: '#ebc19c',
  }
})

const TextField_ = styled(TextField)`
  width: 100%;
  margin-left: 2rem;
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

  const classes = useStyles();

  const handleClickCopyCp = () => {
    setVisibleNotification(true)
    if (navigator.clipboard)
      return navigator.clipboard.writeText(generatedAddress)
    else
      return document.execCommand('copy', true, generatedAddress)
  }

  const generateAddress = (newUnusedAddresses: Array<Address>) => {
    let r = randomInt(0, 19)
    if (oldUnusedAddressIndex !== undefined)
      while (r === oldUnusedAddressIndex)
        r = randomInt(0, 19)
    setOldUnusedAddressIndex(r)
    const unusedAddress = newUnusedAddresses[r].segwitAddress
    console.log(unusedAddress, r)
    setGeneratedAddress(unusedAddress)
    generateQR(unusedAddress)
  }

  const handleCloseNotification = (visibility: boolean) => {
    setVisibleNotification(visibility)
  }

  const generateQR = async (segwitAddress: string) => {
    try {
      const paymentURI = `bitcoin:${segwitAddress}`
      const url = await QRCode.toDataURL(paymentURI)
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
      <Box fontSize="2rem" mb="2rem" display="flex" justifyContent="center">
        <h2>
          Receive satoshis
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src={qrCodeUrl} alt="qrcode-img" />
        <Box
          mt="1rem"
          //width="40%"
          width="100%"
          display="flex"
        >
          <TextField_
            variant="outlined"
            inputProps={{
              readOnly: true,
              className: classes.input,
            }}
            label="Address"
            value={generatedAddress}
            onClick={handleClickCopyCp}
          >
          </TextField_>
          <IconButton onClick={handleClickCopyCp}>
            <FileCopyIcon />
          </IconButton>
          <CopyCpNotification
            open={visibleNotification}
            onClose={(open)=>{handleCloseNotification(open)}}
          />
        </Box>
        <Box mt="1rem">
          <Button
            variant="contained"
            size="large"
            onClick={() => {generateAddress(unusedAddresses)}}
          >
            GENERATE
          </Button>
        </Box>
      </Box>
    </>
  )
}

const getUnusedAddresses = (addresses: Array<Address>): Array<Address> => {
  let unusedAddresses: Array<Address> = []
  for (const address of addresses)
    if (! address.used)
      unusedAddresses.push(address)
  return unusedAddresses
}

const randomInt= (min: number, max: number): number => {
  // Inclusive random integer
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export default Receive;

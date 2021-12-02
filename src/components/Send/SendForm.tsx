import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import theme from '../../theme'

import styled from '@emotion/styled'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Switch from '@mui/material/Switch';

import AddressInputs from './AddressInputs'
import Summary from './Summary'
import FeeSlider from './FeeSlider'

import PasswordPopup from '../Home/PasswordPopup'

import walletUtils, {AddressBalance, Wallet, FeeEstimate} from '../../lib/walletUtils'

const TextField_ = styled(TextField)`
  //background-color: white;
  width: 100%;
`

interface Props {
  addressesBalances: Array<AddressBalance>
}

const Send = (props: Props): JSX.Element => {
  const wallet = useSelector((state: any): Wallet => {
    return state.walletSlice.wallet
  })


  const [toAddress, setToAddress] = useState('')
  const [invalidAddress, setInvalidAddress] = useState(true)
  const [addressIsEmpty, setAddressIsEmpty] = useState(true)

  const [sats, setSats] = useState(0)
  const [invalidSats, setInvalidSats] = useState(true)
  const [invalidSatsMsg, setInvalidSatsMsg] = useState('')

  const [insufficientFunds, setInsufficientFunds] = useState(false)

  const [feeRate, setFeeRate] = useState(1)
  const [feeDescription, setFeeDescription] = useState('')
  const [feeEstimates, setFeeEstimates] = useState<Array<FeeEstimate>>([])
  const [recommendedFeeRate, setRecommendedFeeRate] = useState<number | undefined>(undefined)
  const [automaticFeeRate, setAutomaticFeeRate] = useState(true)

  const [fee, setFee] = useState<number | undefined>(undefined)
  const [txSize, setTxSize] = useState<number | undefined>(undefined)
  const [rawTx, setRawTx] = useState<string | undefined>(undefined)

  const [transactionIsValid, setTransactionIsValid] = useState(false)
  const [signed, setSigned] = useState(false)

  const [showPasswordPopup, setShowPasswordPopup] = useState(false)

  useEffect(() => {
    handleFeeEstimates()
  }, [feeRate])

  useEffect(() => {
    checkTransactionValidity()
  }, [insufficientFunds, invalidSats, invalidAddress])

  const checkTransactionValidity = () => {
    if (
      insufficientFunds
      || invalidSats
      || invalidAddress
    )
      setTransactionIsValid(false)
    else
      setTransactionIsValid(true)
  }

  const handleFeeEstimates = async () => {
    try {
      if (recommendedFeeRate === undefined) {
        //initialise
        const newFeeEstimates = await walletUtils.getFeeEstimates()
        setFeeEstimates(newFeeEstimates)

        const newRecommendedFeeRate = newFeeEstimates[0].feeRate
        setRecommendedFeeRate(newRecommendedFeeRate)
        setFeeRate(newRecommendedFeeRate)

        const newFeeDescription = generateFeeDescrption(newFeeEstimates[0].block)
        setFeeDescription(newFeeDescription)
        setFeeAndTxSize(0, newRecommendedFeeRate)
      } else {
        const estimatedBlock = getEstimatedBlock(feeRate, feeEstimates)
        const newFeeDescription = generateFeeDescrption(estimatedBlock)
        setFeeDescription(newFeeDescription)
      }
    } catch(err) {
      console.error(err)
      throw 'Could not connect'
    }
  }

  const handleToAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddresses = event.target.value
    if (newAddresses !== '')
      setAddressIsEmpty(false)
    else
      setAddressIsEmpty(true)
    setInvalidAddress(
      ! walletUtils.validateAddress(newAddresses)
    )
    setToAddress(newAddresses)
  }

  const handleSats = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSats = Number(event.target.value)
    setSats(newSats)
    if (newSats > wallet.balance || newSats <= 0) {
      setInvalidSats(true)
      if (newSats === 0)
        setInvalidSatsMsg(`Sats can't be equal to 0`)
      else if (newSats < 0)
        setInvalidSatsMsg(`Sats can't be negative`)
      else if (newSats > wallet.balance)
        setInvalidSatsMsg(`Sats can't be more than balance`)
    } else {
      setInvalidSats(false)
      setInvalidSatsMsg('')
    }

    setFeeAndTxSize(newSats, feeRate)
  }
  const handleFeeRate = (newValue: number) => {
    const newFeeRate = newValue
    setFeeRate(newFeeRate)
    setFeeAndTxSize(sats, newFeeRate)
  }

  const setFeeAndTxSize = (
    newSats: number,
    newFeeRate: number,
  ) => {
    const [_, inputsSats, newFee, newTxSize] = walletUtils.getInputAddresses(
      newSats,
      newFeeRate,
      wallet.addresses,
    )
    //console.log(_, inputsSats)
    if (
      inputsSats === 0
      || newFee + newSats > wallet.balance
      //|| fee === 0
      //|| newTxSize === 0
    ) {
      setFee(undefined)
      setTxSize(undefined)
      setInsufficientFunds(true)
    } else {
      setFee(newFee)
      setTxSize(newTxSize)
      setInsufficientFunds(false)
    }
  }

  const handleAutomaticFeeRate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAutomaticFeeRate = ! event.target.checked
    setAutomaticFeeRate(newAutomaticFeeRate)
    if (newAutomaticFeeRate && recommendedFeeRate) {
      handleFeeRate(recommendedFeeRate)
    }
  }

  const handleSign = () => {
    setShowPasswordPopup(true)
  }

  const signTransaction = (mnemonicSeed: string) => {
    setSigned(true)
    //console.log(sats, feeRate, fee)
    if (fee === undefined)
      throw 'fee is undefined'

    if (
      ! invalidAddress
      && wallet.balance + fee >= sats
      && feeRate >= 0
    ) {
      const [newRawTx, newFee, newTxSize] = walletUtils.generateTransaction(
        toAddress,
        sats,
        feeRate,
        wallet,
        mnemonicSeed,
      )
      console.log(newRawTx)
      setFee(newFee)
      setTxSize(newTxSize)
      setRawTx(newRawTx)

      setShowPasswordPopup(false)
    } else
      console.error('fill form')
  }

  const handleBroadcast = async () => {
    try {
      if (rawTx) {
        const txId = await walletUtils.broadcastTransaction(rawTx)
        console.log(txId)
        await walletUtils.syncWallet()
        window.location.href = '/#/'
      }
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <>
      <Box>
        <TextField_
          label="To"
          variant="filled"
          value={toAddress}
          onChange={handleToAddress}
          error={invalidAddress && !addressIsEmpty}
          helperText={invalidAddress && !addressIsEmpty ? 'Wrong address format!' : ''}
          disabled={signed}
        />
      </Box>
      <Box mt="1rem">
        <TextField_
          label="Sats"
          type="number"
          variant="filled"
          value={sats ? sats : ''}
          onChange={handleSats}
          disabled={signed}
          error={invalidSatsMsg !== ''}
          helperText={invalidSatsMsg !== '' ? invalidSatsMsg : ''}
        />
      </Box>
      <Box mt="1rem">
        <Box
          display="flex"
          alignItems="center"
          ml="-12px" //to offset the 12px padding of the Swtich component
        >
          <Switch
            color="default"
            disabled={signed}
            onChange={handleAutomaticFeeRate}
          />
          <Box
            component="h3"
            color={theme.palette.primary.main}
          >
            {automaticFeeRate
              ? 'Automatic fee rate'
              : 'Manual fee rate'
            }
          </Box>
        </Box>

        {automaticFeeRate
          ? <Box component="p" mb="0.5rem">
              <b>{feeRate}</b> sat/byte
            </Box>
          : <FeeSlider
              onChange={(newFeeRate)=>{handleFeeRate(newFeeRate)}}
              feeRate={feeRate}
              recommendedFeeRate={recommendedFeeRate}
              disabled={signed}
            />
        }
        {insufficientFunds
          ? <Box color={theme.palette.error.main}>
              Can't afford this fee!
            </Box>
          : <Box component="p">
              <i>
                {feeDescription}
              </i>
            </Box>
        }
      </Box>
      {/*<Box mt="1rem">
        <AddressInputs
          addressesBalances={props.addressesBalances}
        />
      </Box>*/}
      <Box 
        mt="2rem"
      >
        <Summary
          sats={sats}
          feeRate={feeRate}
          fee={fee}
          txSize={txSize}
        />
      </Box>

      <Box mt="2rem" display="flex" justifyContent="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleSign}
          disabled={signed || ! transactionIsValid}
        >
          Sign
        </Button>

        <PasswordPopup
          open={showPasswordPopup}
          close={()=>{setShowPasswordPopup(false)}}
          onSubmit={(mnemonicSeed: string) => {
            signTransaction(mnemonicSeed)
          }}
        />
        <Box ml="1rem">
          <Button
            disabled={!signed}
            variant="contained"
            size="large"
            onClick={handleBroadcast}
          >
            Broadcast
          </Button>
        </Box>
      </Box>
    </>
  )
}

const getEstimatedBlock = (
  feeRate: number,
  feeEstimates: Array<FeeEstimate>
): number => {
  let res = feeEstimates[0].block
  if (feeRate < feeEstimates[0].feeRate) {
    let i = 1
    while (i < feeEstimates.length) {
      if (feeRate <= feeEstimates[i].feeRate)
        res = feeEstimates[i-1].block
      i++
    }
  }
  return res
}

const generateFeeDescrption = (block: number) => {
  // 1 block ~= 10 minutes
  let min = (block - 1) * 10
  let max = block * 10
  let range = `~${min} to ${max} minutes`
  if (min >= 60) {
    min = Math.floor(min / 60)
    max = Math.floor(max / 60)
    if (min === max)
      if (min === 1)
        range = `~${min} hour`
      else
        range = `~${min} hours`
    else
      range = `~${min} to ${max} hours`
  }
  let blockUnits = `blocks`
  if (block === 1)
    blockUnits = `block`

  return `Transaction will be processed in ${block} ${blockUnits} (${range})`
}

export default Send;

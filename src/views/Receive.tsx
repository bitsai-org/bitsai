import React from 'react'

import CopyCpNotification from '../components/Receive/CopyCpNotification'

import Box from '@material-ui/core/Box'
import qrcodeImg from '../media/qrcode.png'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'

import FileCopyIcon from '@material-ui/icons/FileCopy'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  input: {
    color: '#ebc19c',
  }
})

const _TextField = styled(TextField)`
  width: 100%;
  margin-left: 2rem;
`

const Receive = (): JSX.Element => {
  const testnetAddress = 'tb1q3squrqfuyhl3q6vjnyenypmw6fjwgqjxdfjpra'
  const classes = useStyles();

  const [visibleNotification, setVisibleNotification] = React.useState(false)
  const handleClickCopyCp = () => {
    setVisibleNotification(true)
  }

  const handleCloseNotification = (visibility: boolean) => {
    setVisibleNotification(visibility)
  }

  return (
    <>
      <Box fontSize="2rem" mb="2rem" display="flex" justifyContent="center">
        <h2>
          Receive satoshis
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mb="1rem">
          <Button variant="contained" size="large">
            GENERATE
          </Button>
        </Box>
        <img src={qrcodeImg} alt="qrcode-img" />
        <Box mt="1rem" width="40%" display="flex">
          <_TextField
            variant="outlined"
            inputProps={{
              readOnly: true,
              className: classes.input,
            }}
            label="Address"
            //defaultValue={testnetAddress}
            defaultValue={testnetAddress}
            onClick={handleClickCopyCp}
          />
          <IconButton onClick={handleClickCopyCp}>
            <FileCopyIcon />
          </IconButton>
          <CopyCpNotification 
            open={visibleNotification}
            onClose={(open)=>{handleCloseNotification(open)}}
          />
        </Box>
      </Box>
    </>
  )
}

export default Receive;

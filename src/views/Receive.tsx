import Box from '@material-ui/core/Box'
import qrcodeImg from '../media/qrcode.png'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'

import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const _TextField = styled(TextField)`
width: 100%;
margin-left: 2rem;
`
const Receive = (): JSX.Element => {
  const testnetAddress = 'tb1q3squrqfuyhl3q6vjnyenypmw6fjwgqjxdfjpra'
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
        <Box mt="1rem" width="30%" display="flex">
          <_TextField
            variant="outlined"
            inputProps={{readOnly: true}}
            label="Address"
            //defaultValue={testnetAddress}
            defaultValue={testnetAddress}
          />
          <IconButton>
            <FileCopyIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}

export default Receive;

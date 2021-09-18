import {useState} from 'react'

import styled from 'styled-components'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import AddressInputs from '../components/Send/AddressInputs'
import Summary from '../components/Send/Summary'

const TextField_ = styled(TextField)`
  background-color: white;
  width: 100%;
`

const Send = (): JSX.Element => {
  const [signed, setSigned] = useState(false)
  return (
    <>
      <Box fontSize="2rem" mb="2rem" display="flex" justifyContent="center">
        <h2>
          Send satoshis
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          justifySelf="center"
          display="flex"
          justifyContent="center"
          //alignItems="center"
          flexDirection="column"
          width="50%"
        >
          <Box>
            <TextField_
              label="To"
              variant="filled"
            />
          </Box>
          <Box mt="1rem">
            <TextField_
              label="Sats"
              variant="filled"
            />
          </Box>
          <Box mt="1rem">
            <TextField_
              label="Fee (sat/byte)"
              variant="filled"
            />
          </Box>
          <Box mt="1rem">
            <AddressInputs />
          </Box>
          <Box mt="2rem">
            <Summary/>
          </Box>
          <Box mt="2rem" display="flex" justifyContent="center">
            <Button onClick={()=>{setSigned(true)}} variant="contained" size="large">
              Sign
            </Button>
            <Box ml="1rem">
              <Button disabled={!signed} variant="contained" size="large">
                Broadcast
              </Button>
            </Box>
          </Box>

        </Box>
      </Box>
    </>
  )
}

export default Send;

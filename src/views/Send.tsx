import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import AddressInputs from '../components/Send/AddressInputs'

const TextFieldStyled = styled(TextField)`
  background-color: white;
`

const Send = (): JSX.Element => {
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
            <TextFieldStyled
              label="To"
              variant="filled"
              color="secondary"
            />
          </Box>
          <Box mt="1rem">
            <TextFieldStyled
              label="Sats"
              variant="filled"
            />
          </Box>
          <Box mt="1rem">
            <TextFieldStyled
              label="Fee (sat/byte)"
              variant="filled"
            />
          </Box>
          <Box mt="1rem">
            <AddressInputs />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Send;

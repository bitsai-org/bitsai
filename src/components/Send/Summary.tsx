import React from 'react'
import Box from '@mui/material/Box'
import theme from '../../theme'


interface Props {
  sats: number,
  feeRate: number,
  fee: number | undefined,
  txSize: number | undefined,
}
const Summary = (props: Props): JSX.Element => {

  return(
    <>
      <Box
        component="h3"
        color={theme.palette.primary.main}
      >
        Summary
      </Box>
      <Box mt="0.4rem" ml="1rem" display="flex">
        <Box>
          <Box>ToSend</Box>
          <Box>Fee</Box>

          <Box mt="1rem">TOTAL</Box>
        </Box>
        <Box ml="1rem">
          <Box><b>{props.sats}</b></Box>
          <Box>
            <b>{props.fee !== undefined ? `${props.fee}` : '?'}</b> = <b>{props.feeRate}</b> x <b>{props.txSize !== undefined ? props.txSize : '?'}</b> vB
          </Box>
          <Box mt="1rem">
            <b>{props.fee !== undefined ? props.fee + props.sats : '?'}</b> sat
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Summary

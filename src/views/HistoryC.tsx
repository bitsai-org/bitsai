import React from 'react'
import theme from '../theme'

import HistoryTable from '../components/HistoryC/HistoryTable'

import Box from '@mui/material/Box'

const HistoryC = (): JSX.Element => {

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
          Transaction History
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <HistoryTable />
        {/*<MuiHistoryTable />*/}
      </Box>
    </>
  )
}

export default HistoryC

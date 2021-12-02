import React from 'react'
import theme from '../theme'

import MuiHistoryTable from '../components/HistoryC/MuiHistoryTable'
import HistoryTable from '../components/HistoryC/HistoryTable'

import Box from '@mui/material/Box'

const HistoryC = (): JSX.Element => {

  return (
    <>
      <Box 
        fontSize="2rem" 
        mb="2rem" 
        display="flex" 
        justifyContent="center"
        color={theme.palette.primary.main}
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

export default HistoryC;

import React from 'react'

import HistoryTable from '../components/HistoryC/HistoryTable'

import Box from '@material-ui/core/Box'

const HistoryC = (): JSX.Element => {

  return (
    <>
      <Box fontSize="2rem" mb="2rem" display="flex" justifyContent="center">
        <h2>
          Transaction History
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        {/*<Box display="flex" flexDirection="row">
        </Box>*/}
        <HistoryTable />
      </Box>
    </>
  )
}

export default HistoryC;

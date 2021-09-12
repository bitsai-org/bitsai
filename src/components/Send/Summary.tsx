import Box from '@material-ui/core/Box'
import React, { useState, } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const Summary = (): JSX.Element => {

  return(
    <>
      <h3>Summary</h3>
      <Box mt="0.4rem" ml="" display="flex">
        <Box>
          <Box>ToSend</Box>
          <Box>Fees</Box>
          
          <Box mt="1rem">TOTAL</Box>
        </Box>
        <Box ml="1rem">
          <Box>2000</Box>
          <Box>250</Box>
          <Box mt="1rem">2250</Box>
        </Box>
      </Box>
      {/*<TableContainer className={classes.table}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <Box>
                  Balance
                </Box>
              </TableCell>
              <TableCell align="left">5000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <Box color="inherit">
                  toSend
                </Box>
              </TableCell>
              <TableCell align="left">-2000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Transaction fee
              </TableCell>
              <TableCell align="left">-250</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>*/}
    </>
  )
}

export default Summary

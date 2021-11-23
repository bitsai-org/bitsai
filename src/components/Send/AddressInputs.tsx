import Box from '@material-ui/core/Box'
import React, { useState, } from 'react';

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {AddressBalance} from '../../lib/walletUtils'

interface Props {
  addressesBalances: Array<AddressBalance>
}

const AddressInputs = (props: Props): JSX.Element => {
  const [manualInputSelector, setManualInputSelector] = useState(false);
  const [accordionExpand, setAccordionExpand] = useState(false);
  const [inputAddresses, setInputAddresses] = useState(['adr1', 'adr2', 'adr3'])

  const fontFamily = " -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"

  const handleInputSelector = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualInputSelector(event.target.checked);
    if (manualInputSelector)
      setAccordionExpand(false)
  };

  const handleAccordion = () => {
    setAccordionExpand(!accordionExpand);
  };

  return(
    <>
      <FormControlLabel
        control={
          <Checkbox
            onChange={handleInputSelector}
            inputProps={{ 'aria-label': 'manual-input-checkbox' }}
            color="default"/>
        }
        //label="Manual input selector"
        label={<Box component="h3" fontSize="1.3rem" fontFamily={fontFamily}>
          Manual input selector
        </Box>}
      />

      <Accordion
        onChange={handleAccordion}
        expanded={accordionExpand}
        disabled={!manualInputSelector}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="expand-input-list"
        >
          <p>
            Inputs
          </p>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column">
            {props.addressesBalances.map((addressBalance: AddressBalance, index: number): JSX.Element =>
              <FormControlLabel
                control={<Checkbox
                  inputProps={{ 'aria-label': 'manual-input-checkbox' }}
                  color="default"/>}
                label={addressBalance.segwitAddress}
                key={index}
              />
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default AddressInputs

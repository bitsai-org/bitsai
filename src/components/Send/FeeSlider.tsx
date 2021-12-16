import React from 'react'
import styled from '@emotion/styled'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Input from '@mui/material/Input'

const Input_ = styled(Input)`
  color: #ebc19c;
`

interface Props {
  onChange: (feeRate: number) => void,
  feeRate: number,
  recommendedFeeRate: number | undefined,
  disabled: boolean,
}

const FeeSlider = (props: Props): JSX.Element => {
  const handleSliderChange = (event: any, newValue: number | Array<number>) => {
    if (typeof newValue === 'number') {
      props.onChange(newValue)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? 1 : Number(event.target.value)
    props.onChange(newValue)
    {/*if (typeof newFeeRate === 'number')
      props.onChange(newFeeRate)*/}
  }

  const handleBlur = () => {
    if (props.feeRate < 0) {
      props.onChange(0)
    } else if (props.feeRate > 100) {
      props.onChange(100)
    }
  }


  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof props.feeRate === 'number' ? props.feeRate : 1}
            onChange={handleSliderChange}
            aria-labelledby="fee-rate-slider"
            min={1}
            max={
              props.recommendedFeeRate
                ? Math.round(props.recommendedFeeRate * 1.5)
                : 100
            }
            disabled={props.disabled}
          />
        </Grid>
        <Grid item>
          <Input_
            value={props.feeRate}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            disabled={props.disabled}
          />
        </Grid>
        <Grid item>
          sat/vByte
        </Grid>
      </Grid>
    </Box>
  )
}

export default FeeSlider

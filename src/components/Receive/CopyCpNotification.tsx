import React from 'react'
import Snackbar from '@mui/material/Snackbar'

import MuiAlert, { AlertProps } from '@mui/material/Alert'

const x = (props: AlertProps, ref: any) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(x)

interface Props {
  open: boolean,
  onClose: (open: boolean) => void,
}

const CopyCpNotification = (props: Props): JSX.Element => {

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    props.onClose(false)
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={props.open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Note archived"
      >
        <Alert
          onClose={handleClose}
          severity="info"
        >
          Address copied to clipboard
        </Alert>
      </Snackbar>
    </>
  )
}

export default CopyCpNotification

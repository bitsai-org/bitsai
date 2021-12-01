import React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((
  props,
  ref,
) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

interface Props {
  open: boolean,
  onClose: (open: boolean) => void,
}

const CopyCpNotification = (props: Props): JSX.Element => {

  const [x, setX] = React.useState(false)

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
        <Alert onClose={handleClose} severity="info">
          Address copied to clipboard
        </Alert>
      </Snackbar>
    </>
  )
}

export default CopyCpNotification

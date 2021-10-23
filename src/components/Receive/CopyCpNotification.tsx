import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const Alert = (props: AlertProps): JSX.Element => {
  return (
    <MuiAlert elevation={6} variant="filled" {...props} />
  )
}

interface Props {
  open: boolean,
  onClose: (open: boolean) => void,
}

const CopyCpNotification = (props: Props): JSX.Element => {

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
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
      {/*<Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={props.open}
        autoHideDuration={1000}
        onClose={handleClose}
        message="Note archived"
        action={
          <>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />*/}
    </>
  )
}

export default CopyCpNotification

import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

export default function CustomizedSnackbar({
  message,
  buttonText,
  onAction,
  severity = 'success',
  duration = 6000,
  buttonClassName = '',
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (onAction) onAction();
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick} className={buttonClassName}>
        {buttonText}
      </Button>
      <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
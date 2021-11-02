import React, { useEffect } from 'react';
import { Snackbar, makeStyles, Slide } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { snackbarActions } from 'src/store/snackbar';

const useStyles = makeStyles(theme => ({
  root: {
    top: theme.spacing(9),
    left: 260,
    zIndex: 100
  }
}));
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function Notification(props) {
  const notify = useSelector(state => state.snackbar);
  const dispatch = useDispatch();
  // const { notify, setNotify } = props;
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(snackbarActions.close());
    // setNotify({
    //   ...notify,
    //   isOpen: false
    // });
  };
  useEffect(() => {
    return () => {
      dispatch(snackbarActions.close());
    };
  }, [dispatch]);

  return (
    <Snackbar
      className={classes.root}
      open={notify.isOpen}
      autoHideDuration={3000}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      onClose={handleClose}
    >
      <Alert severity={notify.type} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  );
}

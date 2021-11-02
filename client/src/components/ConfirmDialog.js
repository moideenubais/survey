import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  makeStyles,
  IconButton,
  useTheme,
  colors,
  Button
} from '@material-ui/core';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';

const useStyles = makeStyles(theme => ({
  dialog: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5)
  },
  dialogTitle: {
    textAlign: 'center'
  },
  dialogContent: {
    textAlign: 'center'
  },
  dialogAction: {
    justifyContent: 'center'
  },
  dangerButton: {
    backgroundColor: colors.red[800],
    '&:hover': {
      backgroundColor: colors.red[600]
    }
  },
  titleIcon: {
    backgroundColor: colors.red[100],
    color: colors.red[800],
    '&:hover': {
      backgroundColor: colors.red[100],
      cursor: 'default'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '8rem'
    }
  }
}));

export default function ConfirmDialog(props) {
  const { confirmDialog, setConfirmDialog } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
      <DialogTitle className={classes.dialogTitle}>
        <IconButton disableRipple className={classes.titleIcon}>
          <NotListedLocationIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button
          onClick={() => {
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          }}
          variant="contained"
        >
          No
        </Button>
        <Button
          variant="contained"
          onClick={confirmDialog.onConfirm}
          className={classes.dangerButton}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import React, { useState, useContext, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
// import { io } from "socket.io-client";
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  MenuItem,
  MenuList,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import Logo from "src/components/Logo";
import AuthContext from "../../context/auth-context";
import AlertDialog from "../../components/confirmModal/confirmModal";
import axios from "axios";
import CONSTANTS from "src/constants";
import { isEmpty } from "lodash";
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60,
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  // const socket = io(CONSTANTS.BASE_URL);
  // const [notifications] = useState([
  //   {title:"You have new orders"}
  // ]);
  const authCtx = useContext(AuthContext);
  const [confirmOpen, setconfirmOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const prevOpen = useRef(open);
  // useEffect(() => {
  //   console.log('in useEff');
  //   // getNotifications();
  //   socket.on('new-notification', response => {
  //     dispatch(
  //       notificationActions.setNotification({
  //         notification: response
  //       })
  //     );
  //     console.log('New notification', response);
  //   });
  //   return () => {
  //     socket.off('new-notification', res => {});
  //   };
  // }, []);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleLogout = () => {
    // localStorage.setItem('auth-token',"");
    // setUserLogin(false);
    authCtx.onLogout();
    navigate("/login", { replace: true });
    setconfirmOpen(false);
  };
  const handleLogoutConfirm = () => {
    setconfirmOpen(true);
  };

  const handleConfirmclose = () => {
    setconfirmOpen(false);
  };

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        {/* <Hidden mdDown> */}
        <IconButton color="inherit" onClick={handleLogoutConfirm}>
          <InputIcon />
        </IconButton>
        {/* <IconButton color="inherit">
            <InputIcon />
          </IconButton> */}
        {/* </Hidden> */}
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
      <AlertDialog
        open={confirmOpen}
        handleClose={handleConfirmclose}
        handleConfirm={handleLogout}
        content="Are you sure"
        title="Logout"
        confirmDialog={true}
        cancelButtonAsOk="CANCEL"
      />
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;

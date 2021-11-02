import React, { useEffect, useContext, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from "@material-ui/core";
import AuthContext from "src/context/auth-context";
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
} from "react-feather";
import NavItem from "./NavItem";
import CONSTANTS from "src/constants";
import { isEmpty } from "lodash";

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { user, userRole } = useContext(AuthContext);

  const itemsInitial = [
    {
      href: "/app/dashboard",
      icon: BarChartIcon,
      title: "Dashboard",
    },

    {
      href: "/app/surveys",
      icon: UserIcon,
      title: "Surveys",
    },
    // {
    //   href: '/app/users',
    //   icon: UsersIcon,
    //   title: 'Users',
    //   childItems: [
    //     useHasAuth('user', 'getAllUsers') && {
    //       href: '/app/users/all',
    //       // icon: BarChartIcon,
    //       title: 'All Users'
    //     }
    //   ]
    // },
    // useHasAuth('route','getAllRoutes') &&
  ];

  let items = itemsInitial.map((item) => {
    if (!isEmpty(item.childItems)) {
      let childArray = [];
      item.childItems.map((child) => {
        if (!isEmpty(child)) childArray.push(child);
      });
      if (!isEmpty(childArray)) {
        item.childItems = childArray;
        return item;
      }
    } else {
      if (item != false) return item;
    }
  });
  items = items.filter((item) => !isEmpty(item));

  // console.log("itesm++++++++++++++",items, "role",user.role)

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src="/static/images/profile.jpg"
          to="/app/dashboard"
        />

        <Typography className={classes.name} color="textPrimary" variant="h5">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.user_type}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              // open = {open}
              childItems={item.childItems}
              // handleCollapse = {handleCollapseOpen}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;

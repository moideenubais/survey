import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles,
  Snackbar,
  Slide,
  Card,
  CardContent
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
// import data from './data';
import CONSTANTS from 'src/constants';
import axios from 'axios';
import { isEmpty } from 'lodash';
import MuiAlert from '@material-ui/lab/Alert';
import Spinner from '../../components/Spinner';
import SomethingWentWrong from 'src/components/SomethingWentWrong';
import { useDispatch } from 'react-redux';
import { getErrorMessage } from 'src/common/common';
import { snackbarActions } from 'src/store/snackbar';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const UserView = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  // const [users] = useState({});
  const [users, setUsers] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [urlParams, setUrlParams] = useState({ limit: limit, page: 1 });
  const [totalRows, setTotalRows] = useState(undefined);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [activeUpdated, setactiveUpdated] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  const handleLimitChange = event => {
    setLimit(event.target.value);
    let tempUrl = urlParams;
    tempUrl.page = page + 1;
    tempUrl.limit = event.target.value;
    setUrlParams(tempUrl);
    getAllUsers();
  };

  const handlePageChange = (event, newPage) => {
    let tempUrl = urlParams;
    tempUrl.limit = limit;
    tempUrl.page = newPage + 1;
    setUrlParams(tempUrl);
    getAllUsers();
    setPage(newPage);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/user', { params: urlParams })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.users);
        const allUsers = response.data.users;
        if (!isEmpty(allUsers)) {
          const totalRows = response.data.info.totalNumber;
          setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setUsers(allUsers);
        } else {
          setUsers([]);
          setTotalRows(0);
        }
      })
      .catch(error => {
        console.log(error);
        setLoadingError(true);
      });
  };
  const handleUpdateActive = (user, index) => {
    // console.log('in handle');
    let updateData = new FormData();
    updateData.append('active', !user.active);
    // if (snackBarOpen) setSnackBarOpen(false);
    // let updateData = {active:!user.active}
    axios
      .put(CONSTANTS.BASE_URL + 'api/user/' + user._id, updateData)
      .then(response => {
        // console.log('in handle res');

        user.active = !user.active;
        let newUsers = users;
        newUsers[index] = user;
        setUsers(newUsers);
        dispatch(
          snackbarActions.open({
            type: 'success',
            message: 'Active updated successfully'
          })
        );
        getAllUsers();
        // setSnackBarOpen(true);
        // setactiveUpdated(true);
        // console.log("+++++++++++++++++++",response.data.users);
        // const allUsers = response.data.users;
        // if (!isEmpty(allUsers)) {
        //   const totalRows = response.data.info.totalNumber;
        //   setTotalRows(totalRows);
        //   // console.log("totol",totalRows)
        //   setUsers(allUsers);
        // } else {
        //   setUsers([]);
        // }
      })
      .catch(error => {
        // setSnackBarOpen(true);
        // setactiveUpdated(false);
        console.log(error);
        let errMsg = getErrorMessage(error, 'Active updation');
        dispatch(
          snackbarActions.open({
            type: 'error',
            message: errMsg
          })
        );
      });
  };
  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };
  const handelSearch = event => {
    // console.log("in")
    let tempUrl = urlParams;
    tempUrl.search = event.target.value;
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllUsers();
  };
  const handleUserTypeSearch = userType => {
    // console.log("in")
    let tempUrl = urlParams;
    if (userType === 'all') {
      if (tempUrl.hasOwnProperty('user_type')) delete tempUrl.user_type;
    } else {
      tempUrl.user_type = userType;
    }
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllUsers();
  };
  let boxContent = <Spinner />;
  if (users && isEmpty(users)) {
    boxContent = (
      <Card>
        <CardContent>
          <Box
            style={{ margin: 'auto', width: 'fit-content', fontWeight: 'bold' }}
          >
            No records found
          </Box>
        </CardContent>
      </Card>
    );
  } else if (users) {
    boxContent = (
      <Results
        users={users}
        onDelete={getAllUsers}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
        total={totalRows}
        onUpdateActive={handleUpdateActive}
        // onDelete={getAllUsers}
      />
    );
  }
  let returnPage = <Spinner />;
  if (loadingError) {
    returnPage = <SomethingWentWrong />;
  } else
    returnPage = (
      <Page className={classes.root} title="Users">
        <Container maxWidth={false}>
          <Toolbar
            onSearchName={event => {
              handelSearch(event);
            }}
            onUserTypeChange={handleUserTypeSearch}
          />
          <Box mt={3}>{boxContent}</Box>
        </Container>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={handleSnackBarClose}
          // TransitionComponent={SlideTransition}
        >
          {activeUpdated ? (
            <Alert onClose={handleSnackBarClose} severity="success">
              Active Updated Successfully
            </Alert>
          ) : (
            <Alert onClose={handleSnackBarClose} severity="error">
              Active Updated Successfully
            </Alert>
          )}
        </Snackbar>
      </Page>
    );
  return returnPage;
};

export default UserView;

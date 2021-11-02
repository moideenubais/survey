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

const SurveyView = () => {
  const classes = useStyles();
  // const [surveys] = useState({});
  const [surveys, setSurveys] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [urlParams, setUrlParams] = useState({ limit: limit, page: 1 });
  const [totalRows, setTotalRows] = useState(undefined);
  const [loadingError, setLoadingError] = useState(false);
  // const [snackBarOpen, setSnackBarOpen] = useState(false);
  // const [featureUpdated, setfeatureUpdated] = useState(false);

  const handleLimitChange = event => {
    setLimit(event.target.value);
    let tempUrl = urlParams;
    tempUrl.page = page + 1;
    tempUrl.limit = event.target.value;
    setUrlParams(tempUrl);
    getAllSurveys();
  };

  const handlePageChange = (event, newPage) => {
    let tempUrl = urlParams;
    tempUrl.limit = limit;
    tempUrl.page = newPage + 1;
    setUrlParams(tempUrl);
    getAllSurveys();
    setPage(newPage);
  };

  useEffect(() => {
    getAllSurveys();
  }, []);

  const getAllSurveys = () => {
    axios
      .get(CONSTANTS.BASE_URL + 'api/survey', { params: urlParams })
      .then(response => {
        // console.log("+++++++++++++++++++",response.data.surveys);
        const allSurveys = response.data.surveys;
        if (!isEmpty(allSurveys)) {
          const totalRows = response.data.info.totalNumber;
          setTotalRows(totalRows);
          // console.log("totol",totalRows)
          setSurveys(allSurveys);
        } else {
          setSurveys([]);
          setTotalRows(0);
        }
      })
      .catch(error => {
        console.log(error);
        setLoadingError(true);
      });
  };
  // const handleUpdateFeature = (survey, index) => {
  //   console.log('in handle');
  //   let updateData = new FormData();
  //   updateData.append('featured', !survey.featured);
  //   if(snackBarOpen)
  //     setSnackBarOpen(false);
  //   // let updateData = {featured:!survey.featured}
  //   axios
  //     .put(CONSTANTS.BASE_URL + 'api/survey/' + survey._id, updateData)
  //     .then(response => {
  //       console.log('in handle res');

  //       survey.featured = !survey.featured;
  //       let newSurveys = surveys;
  //       newSurveys[index] = survey;
  //       setSurveys(newSurveys);
  //       setSnackBarOpen(true);
  //       setfeatureUpdated(true);
  //       // console.log("+++++++++++++++++++",response.data.surveys);
  //       // const allSurveys = response.data.surveys;
  //       // if (!isEmpty(allSurveys)) {
  //       //   const totalRows = response.data.info.totalNumber;
  //       //   setTotalRows(totalRows);
  //       //   // console.log("totol",totalRows)
  //       //   setSurveys(allSurveys);
  //       // } else {
  //       //   setSurveys([]);
  //       // }
  //     })
  //     .catch(error => {
  //       setSnackBarOpen(true);
  //       setfeatureUpdated(false);
  //       console.log(error);
  //     });
  // };
  // const handleSnackBarClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setSnackBarOpen(false);
  // };
  const handelSearch = event => {
    // console.log("in")
    let tempUrl = urlParams;
    tempUrl.search = event.target.value;
    setUrlParams(tempUrl);
    // urlParams.customerName = event.target.value;
    getAllSurveys();
  };
  let boxContent = <Spinner />;
  if (surveys && isEmpty(surveys)) {
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
  } else if (surveys) {
    boxContent = (
      <Results
        surveys={surveys}
        onDelete={getAllSurveys}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
        total={totalRows}
        // onUpdateFeature={handleUpdateFeature}
        // onDelete={getAllSurveys}
      />
    );
  }
  let returnPage = <Spinner />;
  if (loadingError) {
    returnPage = <SomethingWentWrong />;
  } else
    returnPage = (
      <Page className={classes.root} title="Surveys">
        <Container maxWidth={false}>
          <Toolbar
            onSearchName={event => {
              handelSearch(event);
            }}
          />
          <Box mt={3}>{boxContent}</Box>
        </Container>
        {/* <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={handleSnackBarClose}
          // TransitionComponent={SlideTransition}
        >
          {featureUpdated ? (
            <Alert onClose={handleSnackBarClose} severity="success">
              Featured Updated Successfully
            </Alert>
          ) : (
            <Alert onClose={handleSnackBarClose} severity="error">
              Featured Updated Successfully
            </Alert>
          )}
        </Snackbar> */}
      </Page>
    );
  return returnPage;
};

export default SurveyView;

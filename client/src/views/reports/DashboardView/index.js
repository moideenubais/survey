import React, { useEffect, useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";
import CountCard from "./CountCard";
import BarGraph from "./BarGraph";
import axios from "axios";
import CONSTANTS from "../../../constants";
import { DateRange } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [surveyData, setSurveyData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getSurveyData();
    getUserData();
  }, []);

  const getSurveyData = () => {
    axios
      .get(CONSTANTS.BASE_URL + "api/survey/analytics")
      .then((response) => {
        const surveyData = response.data;
        console.log("data", surveyData);
        setSurveyData(surveyData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getUserData = () => {
    axios
      .get(CONSTANTS.BASE_URL + "api/user/analytics")
      .then((response) => {
        const userData = response.data;
        console.log("brand data", userData);
        setUserData(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDataValues = (responds) => {
    const values = [];
    responds.forEach((response) => {
      values.push(response.count);
    });
    return values;
  };
  const getDataLabels = (responds) => {
    const labels = [];
    responds.forEach((response) => {
      labels.push(response.survey[0].title);
    });
    return labels;
  };

  return (
    surveyData &&
    userData && (
      // categoryData &&
      <Page className={classes.root} title="Dashboard">
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={6} sm={6} xl={6} xs={12}>
              <CountCard title="TOTAL SURVEYS" count={surveyData.surveyCount} />
            </Grid>
            <Grid item lg={6} sm={6} xl={6} xs={12}>
              <CountCard title="TOTAL USERS" count={userData.userCount} />
            </Grid>
            {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TasksProgress totalCategories={surveyData.categories.length} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProfit totalBrands={surveyData.brands.length} />
            </Grid> */}
            <Grid item lg={6} md={12} xl={6} xs={12}>
              <BarGraph
                title="Responses per survey"
                tooltip="Number of responses"
                dataValues={getDataValues(surveyData.responds)}
                dataLabels={getDataLabels(surveyData.responds)}
              />
            </Grid>
            <Grid item lg={6} md={12} xl={6} xs={12}>
              <BarGraph
                title="Surveys per user"
                tooltip="Number of surveys taken"
                dataValues={userData.responds.map((res) => res.count)}
                dataLabels={userData.responds.map((res) => res.name)}
              />
            </Grid>
          </Grid>
        </Container>
      </Page>
    )
  );
};

export default Dashboard;

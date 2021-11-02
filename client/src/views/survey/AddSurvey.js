import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, FieldArray } from "formik";
import CONSTANTS from "../../constants";
import axios from "axios";
import Image from "material-ui-image";
import { useDispatch } from "react-redux";
import { getErrorMessage } from "src/common/common";
import NotFoundView from "../errors/NotFoundView";

import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tab,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  Grid,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import Page from "src/components/Page";
import { isEmpty, rest } from "lodash";
import Spinner from "../../components/Spinner";
import TabPanel from "src/components/TabPanel";
import { snackbarActions } from "src/store/snackbar";
import ConfirmDialog from "src/components/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  imageStyle: {
    paddingLeft: "25px",
    width: "150px",
    height: "100px",
  },
  buttonStyle: {
    // width: '100px',
    // height:"50px",
    marginRight: "10px",
    marginLeft: "10px",
  },
  richEditor: {
    border: "1px #d0c0c0 solid",
    margin: "10px 0px",
  },
  uploadBigImage: {
    height: "100px",
    margin: "10px",
  },
}));

const AddSurvey = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const [surveys, getSurveys] = useState([]);
  const [translationModel, setTranslationModel] = useState(false);
  const [bannerImageFiles, setBannerImageFiles] = useState(null);
  const [logoImageFile, setLogoImageFile] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });

  const languages = [
    { key: "en", label: "English" },
    { key: "ar", label: "Arabic" },
  ];

  const getLanguageLabel = (key) => {
    return languages.filter((language) => language.key === key)[0].label;
  };

  const getImages = (images) => {
    return images.map((image, index) => (
      <img className={classes.uploadBigImage} src={image} key={index + image} />
    ));
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const handleModelOpen = () => {
    setTranslationModel(true);
  };

  const handleModelClose = () => {
    setTranslationModel(false);
  };

  const page = (
    <Page className={classes.root} title="Add Survey">
      <Container maxWidth="md">
        <Formik
          initialValues={{
            title: "",
            description: "",
            credit: 0,
            question_answers: [
              {
                question: "",
                answers: ["", "", "", ""],
              },
            ],
          }}
          validationSchema={Yup.object().shape({
            question_answers: Yup.array().of(
              Yup.object().shape({
                question: Yup.string()
                  .max(255)
                  .required("Question required"),
                // survey_description: Yup.string(),
                answers: Yup.array().of(
                  Yup.string()
                    .max(255)
                    .required("Answer required")
                ),
              })
            ),
            title: Yup.string().required("Title required"),
            description: Yup.string(),
            credit: Yup.number().required("Credit required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            let data = {
              title: values.title,
              credit: values.credit,
              question_answers: values.question_answers,
            };
            if (!isEmpty(values.description))
              data.description = values.description;
            axios
              .post(CONSTANTS.BASE_URL + "api/survey", data)
              .then((response) => {
                dispatch(
                  snackbarActions.open({
                    type: "success",
                    message: "Survey added successfully",
                  })
                );
                navigate(-1);
              })
              .catch((error) => {
                console.log(error);
                let errMsg = getErrorMessage(error, "Add survey");
                dispatch(
                  snackbarActions.open({
                    type: "error",
                    message: errMsg,
                  })
                );
                setSubmitting(false);
              });
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            ...formProps
          }) => (
            <React.Fragment>
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader title="Add Survey" />
                  <Divider />
                  <CardContent>
                    <TextField
                      fullWidth
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                      label="Title"
                      margin="normal"
                      name="title"
                      onChange={handleChange}
                      type="text"
                      value={values.title}
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      error={Boolean(touched.description && errors.description)}
                      helperText={touched.description && errors.description}
                      label="Description"
                      margin="normal"
                      name="description"
                      multiline
                      onChange={handleChange}
                      type="text"
                      value={values.description}
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      error={Boolean(touched.credit && errors.credit)}
                      helperText={touched.credit && errors.credit}
                      label="Credit"
                      margin="normal"
                      name="credit"
                      onChange={handleChange}
                      type="number"
                      value={values.credit}
                      variant="outlined"
                    />
                    <FieldArray name="question_answers">
                      {(fieldArrayProps) => {
                        const { push, remove, form } = fieldArrayProps;
                        const { values } = form;
                        const { question_answers } = values;
                        return (
                          <Grid container item xs={12} spacing={2}>
                            {question_answers.map((content, index) => (
                              <>
                                <Grid
                                  container
                                  item
                                  xs={12}
                                  spacing={2}
                                  alignItems="center"
                                  key={index}
                                >
                                  <Grid item xs>
                                    <TextField
                                      fullWidth
                                      error={Boolean(
                                        touched[
                                          `question_answers[${index}].question`
                                        ] &&
                                          errors[
                                            `question_answers[${index}].question`
                                          ]
                                      )}
                                      helperText={
                                        touched[
                                          `question_answers[${index}].question`
                                        ] &&
                                        errors[
                                          `question_answers[${index}].question`
                                        ]
                                      }
                                      label={`Question ${index + 1}`}
                                      margin="normal"
                                      name={`question_answers[${index}].question`}
                                      onChange={handleChange}
                                      type="text"
                                      value={
                                        values.question_answers[index].question
                                      }
                                      variant="outlined"
                                      size="small"
                                    />
                                  </Grid>

                                  {question_answers.length > 1 ? (
                                    <Grid item xs={1}>
                                      <Tooltip title="Remove Path">
                                        <IconButton
                                          color="error"
                                          aria-label="remove"
                                          variant="contained"
                                          className={classes.dangerButton}
                                          onClick={() => remove(index)}
                                        >
                                          <Delete />
                                        </IconButton>
                                      </Tooltip>
                                    </Grid>
                                  ) : (
                                    ""
                                  )}
                                </Grid>
                                <Grid
                                  container
                                  item
                                  xs={12}
                                  spacing={2}
                                  alignItems="center"
                                  key={index}
                                >
                                  {question_answers[index].answers.map(
                                    (content, answerIndex) => (
                                      <Grid item xs={3}>
                                        <TextField
                                          fullWidth
                                          error={Boolean(
                                            touched[
                                              `question_answers[${index}].answers[${answerIndex}]`
                                            ] &&
                                              errors[
                                                `question_answers[${index}].answers[${answerIndex}]`
                                              ]
                                          )}
                                          helperText={
                                            touched[
                                              `question_answers[${index}].answers[${answerIndex}]`
                                            ] &&
                                            errors[
                                              `question_answers[${index}].answers[${answerIndex}]`
                                            ]
                                          }
                                          label={`Option ${answerIndex + 1}`}
                                          margin="normal"
                                          name={`question_answers[${index}].answers[${answerIndex}]`}
                                          onChange={handleChange}
                                          type="text"
                                          value={
                                            question_answers[index].answers[
                                              answerIndex
                                            ]
                                          }
                                          variant="outlined"
                                          size="small"
                                        />
                                      </Grid>
                                    )
                                  )}
                                </Grid>
                              </>
                            ))}
                            <Grid
                              container
                              item
                              xs={12}
                              spacing={2}
                              justify="flex-end"
                            >
                              <Grid item xs={1}>
                                <Tooltip title="Add Question">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() =>
                                      push({
                                        question: "",
                                        answers: ["", "", "", ""],
                                      })
                                    }
                                  >
                                    ADD
                                  </Button>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      }}
                    </FieldArray>

                    {/* <ConfirmDialog
                      confirmDialog={confirmDialog}
                      setConfirmDialog={setConfirmDialog}
                    /> */}
                  </CardContent>
                  {/* <Divider /> */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    padding="10px"
                  >
                    {/* <Box className={classes.imageStyle}>{logoImageRender}</Box> */}
                    <Box>
                      <Button
                        color="red"
                        variant="contained"
                        onClick={() => {
                          navigate(-1);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        className={classes.buttonStyle}
                        disabled={isSubmitting}
                      >
                        Add Survey
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </form>
            </React.Fragment>
          )}
        </Formik>
      </Container>
    </Page>
  );
  return page;
};

export default AddSurvey;

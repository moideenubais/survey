import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, FieldArray } from "formik";
import CONSTANTS from "../../constants";
import { useDispatch } from "react-redux";
import { getErrorMessage } from "src/common/common";
import NotFoundView from "../errors/NotFoundView";
import Spinner from "../../components/Spinner";
import { isEmpty, isUndefined, find } from "lodash";
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
import Image from "material-ui-image";
import axios from "axios";
import TabPanel from "src/components/TabPanel";
import SomethingWentWrong from "src/components/SomethingWentWrong";
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
  imageStyle: {
    paddingLeft: "25px",
    width: "150px",
    height: "100px",
  },
  buttonStyle: {
    // width:"150px",
    // height:"40px",
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

const EditSurvey = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  let [surveyData, setSurveyData] = useState(null);
  const [translationModel, setTranslationModel] = useState(false);
  const [bannerImageFiles, setBannerImageFiles] = useState(null);
  const [logoImageFile, setLogoImageFile] = useState(null);
  const [loadingError, setLoadingError] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });

  //   const [surveys, getSurveys] = useState([]);
  const languages = [
    { key: "en", label: "English" },
    { key: "ar", label: "Arabic" },
  ];
  const getImages = (images) => {
    return images.map((image, index) => (
      <img className={classes.uploadBigImage} src={image} key={index + image} />
    ));
  };

  useEffect(() => {
    getSingleSurvey();
    // getAllSurveys();
    // getAllSurveys();
  }, []);

  const getSingleSurvey = () => {
    axios
      .get(CONSTANTS.BASE_URL + "api/survey/" + id)
      .then((response) => {
        const surveyData = response.data;
        setSurveyData(surveyData);
        if (!isEmpty(surveyData.banner_urls))
          setBannerImageFiles(
            Array.from(surveyData.banner_urls).map(
              (image) => CONSTANTS.BASE_URL + image
            )
          );
        if (surveyData.logo_url)
          setLogoImageFile(CONSTANTS.BASE_URL + surveyData.logo_url);
      })
      .catch((error) => {
        console.log(error);
        let errMsg = getErrorMessage(error, "Getting current survey");
        dispatch(
          snackbarActions.open({
            type: "error",
            message: errMsg,
          })
        );
        setLoadingError(true);
      });
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

  const getLanguageLabel = (key) => {
    return languages.filter((language) => language.key === key)[0].label;
  };
  const getRousourceBundleData = (resourceBundle) => {
    return resourceBundle.map((resource) => {
      let address = resource.address;
      if (!address) {
        address = {
          building_name: "",
          street: "",
          city: "",
        };
      } else {
        if (!address.building_name) address.building_name = "";
        if (!address.street) address.street = "";
        if (!address.city) address.city = "";
      }
      return { ...resource, address };
    });
  };
  let page = <Spinner />;
  if (loadingError) {
    page = <SomethingWentWrong />;
  } else if (surveyData)
    page = (
      <Page className={classes.root} title="Survey Update">
        <Container maxWidth="md">
          <Formik
            initialValues={{
              title: surveyData.title,
              description: surveyData.description ? surveyData.description : "",
              credit: surveyData.credit,
              question_answers: surveyData.question_answers,
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
              console.log("vlasue", values);
              let data = {
                title: values.title,
                credit: values.credit,
                question_answers: values.question_answers,
              };
              if (!isEmpty(values.description))
                data.description = values.description;
              axios
                .put(CONSTANTS.BASE_URL + "api/survey/" + surveyData._id, data)
                .then((response) => {
                  // console.log(response.data);
                  // const bill = response.data;
                  // getBills(allBills);
                  // navigate('/bills', { replace: true });
                  // props.history.goBack();
                  dispatch(
                    snackbarActions.open({
                      type: "success",
                      message: "Survey updated successfully",
                    })
                  );
                  navigate(-1);
                })
                .catch((error) => {
                  console.log(error);
                  let errMsg = getErrorMessage(error, "Update survey");
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
                    <CardHeader
                      // subheader="Update Bill"
                      title="Update Survey"
                    />
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
                        error={Boolean(
                          touched.description && errors.description
                        )}
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
                                          values.question_answers[index]
                                            .question
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
                    </CardContent>
                    {/* <Divider /> */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      padding="10px"
                    >
                      {/* <Box className={classes.imageStyle}>
                        <Image
                          src={imageFile}
                          aspectRatio={9 / 3}
                          alt="upload Image"
                          name="imageSource"
                        />
                      </Box> */}
                      <Box>
                        <Button
                          color="red"
                          variant="contained"
                          // type="submit"
                          // className={classes.buttonStyle}

                          // disabled={isSubmitting}
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
                          Update Survey
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

export default EditSurvey;

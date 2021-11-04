import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import CONSTANTS from "../../constants";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
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
} from "@material-ui/core";
import Page from "src/components/Page";
// import { useDispatch } from "react-redux";
import { getErrorMessage } from "src/common/common";
import { snackbarActions } from "src/store/snackbar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [error, setError] = useState({ err: false, msg: "" });

  return (
    <Page className={classes.root} title="Register">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: "",
              name: "",
              password: "",
              confirm_password: "",
              policy: false,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              name: Yup.string()
                .max(255)
                .required("Name is required"),
              password: Yup.string()
                .max(255)
                .required("password is required"),
              confirm_password: Yup.string()
                .max(255)
                .required("confirm password is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              let data = {
                name: values.name,
                email: values.email,
                password: values.password,
                confirm_password: values.confirm_password,
              };

              axios
                .post(CONSTANTS.BASE_URL + "api/user", data)
                .then((response) => {
                  // dispatch(
                  //   snackbarActions.open({
                  //     type: "success",
                  //     message: "Registered successfully",
                  //   })
                  // );
                  navigate("/app/surveys", { replace: true });
                })
                .catch((error) => {
                  console.log(error);
                  let errMsg = getErrorMessage(error, "User register");
                  setError({ err: true, msg: errMsg });
                  // dispatch(
                  //   snackbarActions.open({
                  //     type: "error",
                  //     message: errMsg,
                  //   })
                  // );
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
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Create new account
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Use your email to create new account
                  </Typography>
                </Box>
                {error.err ? <Alert severity="error">{error.msg}</Alert> : null}
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label="First name"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(
                    touched.confirm_password && errors.confirm_password
                  )}
                  fullWidth
                  helperText={
                    touched.confirm_password && errors.confirm_password
                  }
                  label="confirm_password"
                  margin="normal"
                  name="confirm_password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.confirm_password}
                  variant="outlined"
                />

                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{" "}
                  <Link component={RouterLink} to="/login" variant="h6">
                    Sign in
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;

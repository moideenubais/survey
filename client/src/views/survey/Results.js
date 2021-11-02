import React, { useState, useContext } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch } from "react-redux";
import { getErrorMessage } from "src/common/common";
import NotFoundView from "../errors/NotFoundView";
import Spinner from "../../components/Spinner";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Switch,
  FormControlLabel,
  IconButton,
  colors,
  Button,
} from "@material-ui/core";
import getInitials from "src/utils/getInitials";
import CONSTANTS from "src/constants";
import { useNavigate } from "react-router-dom";
import SimpleModal from "../../components/Modal/Modal";
import AlertDialog from "../../components/confirmModal/confirmModal";
import axios from "axios";
import { isEmpty } from "lodash";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { snackbarActions } from "src/store/snackbar";
import ConfirmDialog from "src/components/ConfirmDialog";
import AuthContext from "src/context/auth-context";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2),
  },
  dangerButton: {
    color: colors.red[500],
    // color: 'white'
  },
  logoImage: {
    // color: colors.red[500],
    width: "120px",
    // color: 'white'
  },
  // iconImage: {
  //   // color: colors.red[500],
  //   width:"32px"
  //   // color: 'white'
  // },
  horizontalSpace: {
    display: "inline-table",
    width: "30px",
    height: "10px",
  },
  cellStyle: {
    whiteSpace: "normal",
    textOverflow: "ellipsis",
    overflow: "hidden",
    height: "100%",
    // width: '123px',
    // display: 'block',
    // minWidth: '123px'
    //   '& *':{

    // }
  },
}));

const Results = ({
  className,
  surveys,
  page,
  limit,
  total,
  handlePageChange,
  handleLimitChange,
  // onUpdateFeature,
  onDelete,
  ...rest
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [confirmOpen, setconfirmOpen] = useState(false);
  const [modalBody, setModalBody] = useState({
    title: "Delete",
    content: "Are you sure",
  });
  const [cancelButtonAsOk, setCancelButtonAsOk] = useState("CANCEL");
  // const [confirmDialog, setConfirmDialog] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });

  const handleDelete = (survey) => {
    setConfirmDialog({ isOpen: false, ...confirmDialog });
    axios
      .delete(CONSTANTS.BASE_URL + "api/survey/" + survey._id)
      .then((response) => {
        // setconfirmOpen(false);
        // survey.openConfirm = false;
        // surveys[index] = survey;
        dispatch(
          snackbarActions.open({
            type: "success",
            message: "Survey deleted successfully",
          })
        );
        onDelete();
      })
      .catch((error) => {
        // setModalBody({ title: 'Error', content: error.response.data.error });
        // setCancelButtonAsOk('OK');
        // setConfirmDialog(false);
        // onDelete();
        console.log(error.response);
        // setconfirmOpen(false);
        // survey.openConfirm = false;
        // surveys[index] = survey;

        let errMsg = getErrorMessage(error, "Survey deletion");
        dispatch(
          snackbarActions.open({
            type: "error",
            message: errMsg,
          })
        );
      });
  };
  const handleDeleteConfirm = (cus, index) => {
    setCancelButtonAsOk("CANCEL");
    setConfirmDialog(true);
    setconfirmOpen(true);
    cus.openConfirm = true;
    surveys[index] = cus;
    // console.log("got here", cus);
  };

  const handleConfirmclose = (cus, index) => {
    cus.openConfirm = false;
    surveys[index] = cus;
    setconfirmOpen(false);
    setModalBody({ title: "Delete", content: "Are you sure" });
    setCancelButtonAsOk("Confirm");
    onDelete();
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === surveys.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < surveys.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell>#</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                {/* <TableCell>Icon</TableCell>
                <TableCell>Featured</TableCell> */}
                {user.user_type === "admin" && (
                  <>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </>
                )}
                {user.user_type === "user" && <TableCell></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.slice(0, limit).map((survey, index) => (
                <TableRow
                  hover
                  key={survey._id}
                  // selected={selectedCustomerIds.indexOf(survey.id) !== -1}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(survey.id) !== -1}
                      onChange={(event) => handleSelectOne(event, survey.id)}
                      value="true"
                    />
                  </TableCell> */}
                  <TableCell>{page * limit + index + 1}</TableCell>
                  <TableCell>
                    <Box alignItems="center" display="flex">
                      {/* <Avatar
                        className={classes.avatar}
                        src={survey.avatarUrl}
                      >
                        {getInitials(survey.name)}
                      </Avatar> */}
                      <Typography color="textPrimary" variant="body1">
                        {survey.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {survey.description ? survey.description : ""}
                  </TableCell>

                  {/* <TableCell>
                    {survey.icon_url?<img className={classes.iconImage} src={CONSTANTS.BASE_URL+survey.icon_url} alt="icon" />:"No Image"}
                  </TableCell> */}
                  {/* <TableCell>
                        <Switch
                          checked={survey.featured}
                          onChange={()=>{onUpdateFeature(survey, index)}}
                          name="checkedFeature"
                        />
                  </TableCell> */}
                  {user.user_type === "user" && (
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          navigate("/app/surveys/takeSurvey/" + survey._id, {
                            replace: false,
                          });
                        }}
                      >
                        Take survey
                      </Button>
                    </TableCell>
                  )}
                  {user.user_type === "admin" && (
                    <>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          className={classes.editButton}
                          onClick={() => {
                            navigate("/app/surveys/editSurvey/" + survey._id, {
                              replace: false,
                            });
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>

                      <TableCell>
                        <IconButton
                          color="error"
                          className={classes.dangerButton}
                          onClick={() => {
                            // handleDeleteConfirm(survey, index);
                            setConfirmDialog({
                              isOpen: true,
                              title: "Are you sure to delete this survey?",
                              subTitle: "You can't undo this operation",
                              onConfirm: () => {
                                handleDelete(survey);
                              },
                            });
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {/* {confirmOpen ? (
                        <AlertDialog
                          open={survey.openConfirm}
                          handleClose={() => {
                            handleConfirmclose(survey, index);
                          }}
                          handleConfirm={() => {
                            handleDelete(survey, index);
                          }}
                          content={modalBody.content}
                          title={modalBody.title}
                          confirmDialog={confirmDialog}
                          cancelButtonAsOk={cancelButtonAsOk}
                        />
                      ) : null} */}
                      </TableCell>
                    </>
                  )}
                  {/* <TableCell>
                    {moment(survey.createdAt).format('DD/MM/YYYY')}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={total}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  surveys: PropTypes.array.isRequired,
};

export default Results;

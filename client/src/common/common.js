export const getErrorMessage = (error, action) => {
  let errMsg = '';
  if (error.response) {
    // Request made and server responded
    errMsg = error.response.data.err ? error.response.data.err : 'Failed';
  } else if (error.request) {
    // The request was made but no response was received
    errMsg = `${action} failed`;
  } else {
    // Something happened in setting up the request that triggered an Error
    errMsg = 'Something went wrong';
  }
  return errMsg;
};
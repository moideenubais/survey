const { createSlice } = require('@reduxjs/toolkit');

const snackInitialValues = { isOpen: false, message: '', type: '' };

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: snackInitialValues,
  reducers: {
    open(state, action) {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    close(state) {
      state.isOpen = false;
    }
  }
});
export default snackbarSlice.reducer;
export const snackbarActions = snackbarSlice.actions;

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AlertType } from '@/components/atoms/alert';

const initialState: AlertType = {
  status: 'success',
  message: '',
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<AlertType>) {
      return action.payload;
    },
    removeAlert(state) {
      return initialState;
    },
  },
});

export const { setAlert, removeAlert } = quizSlice.actions;
export default quizSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import HistoryType from '@/model/history';

const initialState: HistoryType = {
  id: 0,
  time: 0,
  score: 0,
  quiz: {},
  user: {
    id: 0,
    name: '',
  },
  created_at: '',
  updated_at: '',
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setHistory(state, action: PayloadAction<HistoryType>) {
      return action.payload;
    },
    removeHistory(state) {
      return initialState;
    },
  },
});

export const { setHistory, removeHistory } = quizSlice.actions;
export default quizSlice.reducer;

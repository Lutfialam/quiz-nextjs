import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import QuestionType from '@/model/question';

const initialState: QuestionType[] = [];

export const quizSlice = createSlice({
  name: 'quizStart',
  initialState,
  reducers: {
    setQuestion(state, action: PayloadAction<QuestionType[]>) {
      return action.payload;
    },
    removeQuestion(state) {
      return initialState;
    },
  },
});

export const { setQuestion, removeQuestion } = quizSlice.actions;
export default quizSlice.reducer;

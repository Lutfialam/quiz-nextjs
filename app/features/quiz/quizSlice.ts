import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import QuizType from '@/model/quiz';

const initialState: QuizType = {
  id: 0,
  name: '',
  time: 0,
  image: '',
  questions: [],
  created_at: '',
  updated_at: '',
  description: '',
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuiz(state, action: PayloadAction<QuizType>) {
      return action.payload;
    },
    removeQuiz(state) {
      return initialState;
    },
  },
});

export const { setQuiz, removeQuiz } = quizSlice.actions;
export default quizSlice.reducer;

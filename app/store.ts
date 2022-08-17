import { configureStore } from '@reduxjs/toolkit';
import quizSlice from './features/quiz/quizSlice';
import userSlice from './features/user/userSlice';
import alertSlice from './features/alert/alertSlice';
import historySlice from './features/history/historySlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    quiz: quizSlice,
    alert: alertSlice,
    history: historySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

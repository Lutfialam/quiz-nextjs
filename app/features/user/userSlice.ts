import UserType from '@/model/user';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: UserType = {
  id: 0,
  name: '',
  email: '',
  image: '',
  level: '',
  password: '',
  created_at: '',
  updated_at: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      return action.payload;
    },
    removeUser(state) {
      return initialState;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

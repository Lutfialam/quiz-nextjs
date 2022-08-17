type UserType = {
  id?: number;
  name: string;
  email?: string;
  level?: string;
  password?: string;
  passwordConfirmation?: string;
  remember_token?: string;
  created_at?: string;
  updated_at?: string;
  image?: string;
};

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  image: File | null;
};

export type UserError = {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  image?: string;
};

export default UserType;

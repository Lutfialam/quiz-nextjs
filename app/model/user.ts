interface UserType {
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
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  level?: string;
  image: File | null;
}

export interface UserErrorType {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  image?: string;
}

export default UserType;

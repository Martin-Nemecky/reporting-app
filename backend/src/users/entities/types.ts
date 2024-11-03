export type User = {
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: number;
};

export type Profile = Omit<User, 'password'>;

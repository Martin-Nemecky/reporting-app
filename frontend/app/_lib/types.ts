export type User = {
  id: string;
  firstname: string;
  lastname: string;
  dateOfBirth: number;
};

export type FileStat = {
  id: string;
  filename: string;
};

export type Report = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  creator: User;
  files: FileStat[];
};

import { Profile } from 'src/users/entities/types';

export type SaveReportDto = {
  title: string;
  text: string;
  createdAt: number;
  creator: Profile;
};

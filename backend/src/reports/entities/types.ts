import { Profile } from 'src/users/entities/types';

export type Report = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  creator: Profile;
  fileRefs: FileReference[];
};

export type SaveReport = Omit<Report, 'id' | 'fileRefs'>;

export type FileReference = {
  fileId: string;
  ownerId: string;
  originalFilename: string;
};

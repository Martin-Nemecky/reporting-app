export type Profile = {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  dateOfBirth: number;
};

export type FileReference = {
  fileId: string;
  ownerId: string;
  originalFilename: string;
};

export type Report = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  creatorId: string;
  fileRefs: FileReference[];
};

export type SaveReport = Omit<Report, "id" | "fileRefs">;

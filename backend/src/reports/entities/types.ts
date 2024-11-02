export type Report = {
  id: string;
  title: string;
  fileRefs: FileReference[]; //Array<Express.Multer.File>;
  // TODO
};

export type SaveReport = Omit<Report, 'id' | 'fileRefs'>;

export type FileReference = {
  fileId: string;
  originalFilename: string;
};

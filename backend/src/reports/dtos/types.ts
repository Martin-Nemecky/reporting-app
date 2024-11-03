// import { Profile } from 'src/users/entities/types';
// import { FileReference } from '../entities/types';

// export type SaveReportDto = {
//   title: string;
//   text: string;
//   createdAt: number;
//   creator: Profile;
// };

// export type ReportDto = {
//   id: string;
//   title: string;
//   text: string;
//   createdAt: number;
//   creator: Profile;
//   fileRefs: FileReference[];
// };

// private async convertToDto(report: Report): Promise<ReportDto> {
//   return {
//     id: report.id,
//     title: report.title,
//     text: report.text,
//     createdAt: report.createdAt,
//     creator: await this.usersService.findOneUserById(report.creatorId),
//     fileRefs: report.fileRefs,
//   };
// }

// private convertFromSaveDto(saveReportDto: SaveReportDto): SaveReport {
//   return {
//     title: saveReportDto.title,
//     text: saveReportDto.text,
//     createdAt: saveReportDto.createdAt,
//     creatorId: saveReportDto.creator.id,
//   };
// }

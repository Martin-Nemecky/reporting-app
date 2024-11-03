import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileReference, Report, SaveReport } from './entities/types';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as lodash from 'lodash';
import { join } from 'path';
import { FILE_DESTINATION_FOLDER } from 'src/utils/consts';

@Injectable()
export class ReportsRepository {
  /**
   * In memory storage of reports
   */
  private reports: Report[] = [
    {
      id: '1',
      title: 'Lorem ipsum dolor',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      createdAt: 1730627461782,
      creatorId: '1',
      fileRefs: [],
    },
  ];

  async findOneReport(reportId: string, userId: string): Promise<Report> {
    const foundReport = this.reports.find((report) => report.id === reportId);

    if (foundReport == null) {
      throw new HttpException(
        `Report with id: ${reportId} was not found.`,
        HttpStatus.NOT_FOUND,
      );
    } else if (foundReport.creatorId !== userId) {
      throw new HttpException(
        `User does not have the permissions to access report with id: ${reportId}.`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return foundReport;
  }

  async findAllReports(userId: string): Promise<readonly Report[]> {
    return this.reports.filter((report) => report.creatorId === userId);
  }

  async saveReport(report: SaveReport): Promise<Report> {
    const reportToSave: Report = { id: uuidv4(), fileRefs: [], ...report };
    this.reports.push(reportToSave);
    return lodash.cloneDeep(reportToSave);
  }

  async saveReportFiles(
    reportId: string,
    files: Array<Express.Multer.File>,
    userId: string,
  ): Promise<readonly FileReference[]> {
    const foundReport = await this.findOneReport(reportId, userId);

    const fileRefs = files.map((file) => ({
      fileId: file.filename,
      ownerId: userId,
      originalFilename: file.originalname,
    }));

    foundReport.fileRefs.push(...fileRefs);

    return lodash.cloneDeep(fileRefs);
  }

  async updateReport(
    reportId: string,
    reportUpdate: SaveReport,
    userId: string,
  ): Promise<Report> {
    await this.findOneReport(reportId, userId); // check permissions
    this.reports = this.reports.map((report) => {
      if (report.id === reportId) {
        return { id: reportId, fileRefs: report.fileRefs, ...reportUpdate };
      } else {
        return report;
      }
    });

    const updatedReport = await this.findOneReport(reportId, userId);
    return lodash.cloneDeep(updatedReport);
  }

  async deleteReport(reportId: string, userId: string): Promise<Report> {
    const deletedReport = await this.findOneReport(reportId, userId);
    deletedReport.fileRefs.forEach((ref) => {
      fs.rmSync(join(process.cwd(), FILE_DESTINATION_FOLDER, ref.fileId));
    });
    this.reports = this.reports.filter((report) => report.id !== reportId);
    return lodash.cloneDeep(deletedReport);
  }

  async deleteReportFile(
    reportId: string,
    fileId: string,
    userId: string,
  ): Promise<string> {
    const foundReport = await this.findOneReport(reportId, userId);
    const foundRef = foundReport.fileRefs.find((ref) => ref.fileId === fileId);
    if (foundRef == null) {
      console.log('exp');
      throw new HttpException(
        `File with id: ${fileId} was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Remove file from filesystem
    fs.rmSync(join(process.cwd(), FILE_DESTINATION_FOLDER, fileId));

    // Remove file reference from report
    foundReport.fileRefs = foundReport.fileRefs.filter(
      (ref) => ref.fileId !== fileId,
    );

    return foundRef.originalFilename;
  }
}

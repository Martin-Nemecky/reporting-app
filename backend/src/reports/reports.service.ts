import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { FileReference, Report, SaveReport } from './entities/types';

@Injectable()
export class ReportsService {
  constructor(private reportsRepository: ReportsRepository) {}

  async findOneReport(reportId: string, userId: string): Promise<Report> {
    return await this.reportsRepository.findOneReport(reportId, userId);
  }

  async findAllReports(userId: string): Promise<readonly Report[]> {
    return await this.reportsRepository.findAllReports(userId);
  }

  async saveReport(report: SaveReport): Promise<Report> {
    return await this.reportsRepository.saveReport(report);
  }

  async saveReportFiles(
    reportId: string,
    files: Array<Express.Multer.File>,
    userId: string,
  ): Promise<readonly FileReference[]> {
    return await this.reportsRepository.saveReportFiles(
      reportId,
      files,
      userId,
    );
  }

  async updateReport(
    reportId: string,
    reportUpdate: SaveReport,
    userId: string,
  ): Promise<Report> {
    return await this.reportsRepository.updateReport(
      reportId,
      reportUpdate,
      userId,
    );
  }

  async deleteReport(reportId: string, userId: string): Promise<Report> {
    return await this.reportsRepository.deleteReport(reportId, userId);
  }

  async deleteReportFile(
    reportId: string,
    fileId: string,
    userId: string,
  ): Promise<string> {
    return await this.reportsRepository.deleteReportFile(
      reportId,
      fileId,
      userId,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { FileReference, Report, SaveReport } from './entities/types';

@Injectable()
export class ReportsService {
  constructor(private reportsRepository: ReportsRepository) {}

  async findOneReport(reportId: string): Promise<Report> {
    return await this.reportsRepository.findOneReport(reportId);
  }

  async findAllReports(): Promise<readonly Report[]> {
    return await this.reportsRepository.findAllReports();
  }

  async saveReport(report: SaveReport): Promise<Report> {
    return await this.reportsRepository.saveReport(report);
  }

  async saveReportFiles(
    reportId: string,
    files: Array<Express.Multer.File>,
  ): Promise<readonly FileReference[]> {
    return await this.reportsRepository.saveReportFiles(reportId, files);
  }

  async updateReport(
    reportId: string,
    reportUpdate: SaveReport,
  ): Promise<Report> {
    return await this.reportsRepository.updateReport(reportId, reportUpdate);
  }

  async deleteReport(reportId: string): Promise<Report> {
    return await this.reportsRepository.deleteReport(reportId);
  }

  async deleteReportFile(reportId: string, fileId: string): Promise<string> {
    return await this.reportsRepository.deleteReportFile(reportId, fileId);
  }
}

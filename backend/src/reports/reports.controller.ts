import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FileReference, Report, SaveReport } from './entities/types';
import { SaveReportDto } from './dtos/types';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { FILE_DESTINATION_FOLDER } from 'src/utils/consts';

@Controller({ path: 'reports' })
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAllReports(): Promise<readonly Report[]> {
    return await this.reportsService.findAllReports();
  }

  @Get(':id')
  async findOneReport(@Param('id') id: string): Promise<Report> {
    return await this.reportsService.findOneReport(id);
  }

  @Get(':reportId/files/:fileId')
  async findOneReportFile(@Param('fileId') fileId: string) {
    const file = createReadStream(
      join(process.cwd(), FILE_DESTINATION_FOLDER, fileId),
    );
    return new StreamableFile(file);
  }

  @Post()
  async saveReport(@Body() saveReportDto: SaveReportDto): Promise<Report> {
    return await this.reportsService.saveReport(saveReportDto);
  }

  @Post(':reportId/files')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // Change encoding of the filename to the utf-8 (without this piece of code the original filename can be corrupted)
      // See more at: https://stackoverflow.com/questions/72909624/multer-corrupts-utf8-filename-when-uploading-files
      fileFilter: (_req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString(
          'utf8',
        );

        cb(null, true);
      },
      storage: diskStorage({
        destination: join(process.cwd(), FILE_DESTINATION_FOLDER),
        filename: (_req, file, cb) => {
          const uniquePrefix = uuidv4();
          cb(null, `${uniquePrefix}-${file.originalname}`);
        },
      }),
    }),
  )
  async saveReportFiles(
    @Param('reportId') reportId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<readonly FileReference[]> {
    return await this.reportsService.saveReportFiles(reportId, files);
  }

  @Put(':id')
  async updateReport(
    @Param('id') id: string,
    @Body() saveReportDto: SaveReportDto,
  ): Promise<Report> {
    return await this.reportsService.updateReport(
      id,
      saveReportDto as SaveReport,
    );
  }

  @Delete(':id')
  async deleteReport(@Param('id') id: string): Promise<Report> {
    return await this.reportsService.deleteReport(id);
  }

  @Delete(':reportId/files/:fileId')
  async deleteReportFile(
    @Param('reportId') reportId: string,
    @Param('fileId') fileId: string,
  ): Promise<string> {
    return await this.reportsService.deleteReportFile(reportId, fileId);
  }
}

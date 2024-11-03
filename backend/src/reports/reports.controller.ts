import {
  Body,
  Controller,
  Delete,
  Request,
  Get,
  Param,
  Post,
  Put,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
  Header,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FileReference, Report, SaveReport } from './entities/types';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { FILE_DESTINATION_FOLDER } from 'src/utils/consts';
import { UserPayload } from 'src/auth/entities/types';
import { UsersService } from 'src/users/users.service';

type RequestWithPayload = Request & { userPayload: UserPayload };

@Controller({ path: 'reports' })
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAllReports(
    @Request() req: RequestWithPayload,
  ): Promise<readonly Report[]> {
    const reports = await this.reportsService.findAllReports(
      req.userPayload.id,
    );

    return reports;
  }

  @Get(':id')
  async findOneReport(
    @Param('id') id: string,
    @Request() req: RequestWithPayload,
  ): Promise<Report> {
    const report = await this.reportsService.findOneReport(
      id,
      req.userPayload.id,
    );

    return report;
  }

  @Get(':reportId/files/:fileId')
  @Header('Content-Type', 'application/octet-stream')
  async findOneReportFile(
    @Param('reportId') reportId: string,
    @Param('fileId') fileId: string,
    @Request() req: RequestWithPayload,
  ) {
    await this.reportsService.findOneReport(reportId, req.userPayload.id); // verify that the user owns the report
    const file = createReadStream(
      join(process.cwd(), FILE_DESTINATION_FOLDER, fileId),
    );
    return new StreamableFile(file);
  }

  @Post()
  async saveReport(@Body() savedReport: SaveReport): Promise<Report> {
    await this.usersService.findOneUserById(savedReport.creatorId); // verify that the user exists
    const report = await this.reportsService.saveReport(savedReport);

    return report;
  }

  @Post(':reportId/files')
  @UseInterceptors(
    AnyFilesInterceptor({
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
    @Request() req: RequestWithPayload,
  ): Promise<readonly FileReference[]> {
    return await this.reportsService.saveReportFiles(
      reportId,
      files,
      req.userPayload.id,
    );
  }

  @Put(':id')
  async updateReport(
    @Param('id') id: string,
    @Body() saveReport: SaveReport,
    @Request() req: RequestWithPayload,
  ): Promise<Report> {
    const report = await this.reportsService.updateReport(
      id,
      saveReport,
      req.userPayload.id,
    );

    return report;
  }

  @Delete(':id')
  async deleteReport(
    @Param('id') id: string,
    @Request() req: RequestWithPayload,
  ): Promise<Report> {
    const report = await this.reportsService.deleteReport(
      id,
      req.userPayload.id,
    );

    return report;
  }

  @Delete(':reportId/files/:fileId')
  async deleteReportFile(
    @Param('reportId') reportId: string,
    @Param('fileId') fileId: string,
    @Request() req: RequestWithPayload,
  ): Promise<string> {
    return await this.reportsService.deleteReportFile(
      reportId,
      fileId,
      req.userPayload.id,
    );
  }
}

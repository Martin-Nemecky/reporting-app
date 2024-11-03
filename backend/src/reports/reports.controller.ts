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
import { UserPayload } from 'src/auth/entities/types';

type RequestWithPayload = Request & { userPayload: UserPayload };

@Controller({ path: 'reports' })
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAllReports(
    @Request() req: RequestWithPayload,
  ): Promise<readonly Report[]> {
    return await this.reportsService.findAllReports(req.userPayload.id);
  }

  @Get(':id')
  async findOneReport(
    @Param('id') id: string,
    @Request() req: RequestWithPayload,
  ): Promise<Report> {
    return await this.reportsService.findOneReport(id, req.userPayload.id);
  }

  @Get(':reportId/files/:fileId')
  async findOneReportFile(
    @Param('reportId') reportId: string,
    @Param('fileId') fileId: string,
    @Request() req: RequestWithPayload,
  ) {
    await this.reportsService.findOneReport(reportId, req.userPayload.id); // verify that the user owns the report !
    const file = createReadStream(
      join(process.cwd(), FILE_DESTINATION_FOLDER, fileId, req.userPayload.id),
    );
    return new StreamableFile(file);
  }

  @Post()
  async saveReport(@Body() savedReportDto: SaveReportDto): Promise<Report> {
    return await this.reportsService.saveReport(savedReportDto);
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
    @Body() saveReportDto: SaveReportDto,
    @Request() req: RequestWithPayload,
  ): Promise<Report> {
    return await this.reportsService.updateReport(
      id,
      saveReportDto as SaveReport,
      req.userPayload.id,
    );
  }

  @Delete(':id')
  async deleteReport(
    @Param('id') id: string,
    @Request() req: RequestWithPayload,
  ): Promise<Report> {
    return await this.reportsService.deleteReport(id, req.userPayload.id);
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

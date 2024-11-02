import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';
import { ReportsController } from './reports.controller';

@Module({
  imports: [],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}

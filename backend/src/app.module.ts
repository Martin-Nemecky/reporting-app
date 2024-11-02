import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Body, Controller, Get, Param, Post, Res, StreamableFile, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Save a validation report' })
  @ApiResponse({ status: 201, description: 'Report saved' })
  async create(@Body() dto: CreateReportDto, @Request() req: any) {
    return this.reports.create(dto, req.user._id);
  }

  @Get('user/me')
  @ApiOperation({ summary: 'List reports for current user' })
  @ApiResponse({ status: 200, description: 'List of reports' })
  async listMine(@Request() req: any) {
    return this.reports.findByUser(req.user._id);
  }

  @Get('by-id/:id')
  @ApiOperation({ summary: 'Get one report by ID' })
  @ApiResponse({ status: 200, description: 'Report' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getOne(@Param('id') id: string, @Request() req: any) {
    return this.reports.findOne(id, req.user._id);
  }

  @Get('pdf/:id')
  @ApiOperation({ summary: 'Export report as PDF' })
  @ApiResponse({ status: 200, description: 'PDF file' })
  async exportPdf(
    @Param('id') id: string,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const buffer = await this.reports.exportPdf(id, req.user._id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="foundrpilot-report-${id}.pdf"`,
    });
    return new StreamableFile(buffer);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Report } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(dto: CreateReportDto, userId: string): Promise<Report> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const doc = await this.reportModel.create({
      userId,
      ideaDescription: dto.ideaDescription,
      industry: dto.industry,
      targetAudience: dto.targetAudience,
      currentStage: dto.currentStage,
      result: dto.result,
      title: dto.title ?? 'Report',
    });
    return doc.toObject();
  }

  async findByUser(userId: string, limit = 50): Promise<Report[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const list = await this.reportModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return list as unknown as Report[];
  }

  async findOne(id: string, userId: string): Promise<Report> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const doc = await this.reportModel.findOne({ _id: id, userId: user._id }).lean();
    if (!doc) {
      throw new NotFoundException('Report not found');
    }
    return doc as unknown as Report;
  }

  async exportPdf(id: string, userId: string): Promise<Buffer> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const report = await this.findOne(id, userId);
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    let currentPage = pdf.addPage([595, 842]);
    const { height } = currentPage.getSize();
    let y = height - 50;
    const margin = 50;
    const lineHeight = 16;
    const titleSize = 18;
    const sectionSize = 12;

    const ensureSpace = () => {
      if (y < 80) {
        currentPage = pdf.addPage([595, 842]);
        y = height - 50;
      }
    };

    currentPage.drawText('FoundrPilot – Validation Report', {
      x: margin,
      y,
      size: titleSize,
      font: bold,
      color: rgb(0.2, 0.2, 0.4),
    });
    y -= lineHeight * 2;

    const ideaPreview = report.ideaDescription.slice(0, 300) + (report.ideaDescription.length > 300 ? '...' : '');
    currentPage.drawText('Idea: ' + ideaPreview, {
      x: margin,
      y,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= lineHeight * 3;

    const sections: [string, string][] = [
      ['Target Audience', report.result.targetAudience],
      ['Problem Validation', report.result.problemValidation],
      ['Monetization Strategy', report.result.monetizationStrategy],
      ['Key Risks', report.result.keyRisks],
      ['Competitor Landscape', report.result.competitorLandscape],
      ['MVP Roadmap', report.result.mvpRoadmap],
    ];

    for (const [title, content] of sections) {
      ensureSpace();
      currentPage.drawText(title, {
        x: margin,
        y,
        size: sectionSize,
        font: bold,
        color: rgb(0.2, 0.2, 0.4),
      });
      y -= lineHeight;
      const chunk = content.slice(0, 600);
      currentPage.drawText(chunk, {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= lineHeight * (Math.ceil(chunk.length / 70) || 1) + lineHeight;
    }

    const pdfBytes = await pdf.save();
    return Buffer.from(pdfBytes);
  }
}

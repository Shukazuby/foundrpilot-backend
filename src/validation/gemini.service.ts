import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import type { ValidationResult } from './schemas/validation-result.interface';

const VALIDATION_SYSTEM_PROMPT = `You are an expert startup advisor. Your task is to analyze a startup idea and return a JSON object only (no markdown, no code fence). Use this exact structure:
{
  "targetAudience": "string - who will pay and why",
  "problemValidation": "string - is the problem real and worth solving",
  "monetizationStrategy": "string - how to make money",
  "keyRisks": "string - main risks and mitigations",
  "competitorLandscape": "string - competitors and differentiation",
  "mvpRoadmap": "string - concise steps to MVP",
  "confidenceScore": number between 0 and 100,
  "riskLevel": "low" | "medium" | "high"
}
Be concise but actionable. Output only valid JSON.`;

@Injectable()
export class GeminiService {
  private client: GoogleGenAI | null = null;
  private readonly model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * AI integration point: sends the user's idea + optional context to Gemini,
   * then parses the model response into ValidationResult for the API response.
   */
  async validateIdea(
    ideaDescription: string,
    industry?: string,
    targetAudience?: string,
    currentStage?: string,
  ): Promise<ValidationResult> {
    if (!this.client) {
      throw new Error('GEMINI_API_KEY is not set. Add it to .env.');
    }

    const userPrompt = [
      ideaDescription,
      industry ? `Industry: ${industry}` : '',
      targetAudience ? `Target audience: ${targetAudience}` : '',
      currentStage ? `Current stage: ${currentStage}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: userPrompt,
      config: {
        systemInstruction: VALIDATION_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const raw = String((response as { text?: string }).text ?? '').trim();
    if (!raw) {
      throw new Error('Gemini returned empty response');
    }

    const parsed = JSON.parse(raw.trim()) as Record<string, unknown>;
    return this.normalizeResult(parsed);
  }

  private normalizeResult(raw: Record<string, unknown>): ValidationResult {
    const num = (v: unknown) => (typeof v === 'number' ? Math.min(100, Math.max(0, v)) : 50);
    const str = (v: unknown) => (typeof v === 'string' ? v : '');
    const level = (v: unknown) =>
      ['low', 'medium', 'high'].includes(v as string) ? (v as 'low' | 'medium' | 'high') : 'medium';

    return {
      targetAudience: str(raw.targetAudience),
      problemValidation: str(raw.problemValidation),
      monetizationStrategy: str(raw.monetizationStrategy),
      keyRisks: str(raw.keyRisks),
      competitorLandscape: str(raw.competitorLandscape),
      mvpRoadmap: str(raw.mvpRoadmap),
      confidenceScore: num(raw.confidenceScore),
      riskLevel: level(raw.riskLevel),
    };
  }
}

/**
 * Structured AI response from Gemini. Used to type the JSON returned by the
 * validation prompt and to display result cards on the frontend.
 */
export interface ValidationResult {
  targetAudience: string;
  problemValidation: string;
  monetizationStrategy: string;
  keyRisks: string;
  competitorLandscape: string;
  mvpRoadmap: string;
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

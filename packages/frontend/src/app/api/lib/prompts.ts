/**
 * Prompts Service - Frontend API
 *
 * This service provides access to AI prompts used in student analysis.
 * It mirrors the backend PromptsService functionality but is optimized
 * for use in Next.js API routes without NestJS dependency injection.
 *
 * Phase 1: Prompts are hardcoded in the service for quick deployment.
 * Phase 2 (future): Prompts will be fetched from the backend API with versioning.
 */

/**
 * Base system prompt that defines the AI's role and process.
 * Used to initialize the conversation with ChatGPT.
 */
const SYSTEM_PROMPT_TEMPLATE = `You are an expert educational psychologist for K-12 students. Your role is to help teachers analyze individual student learning profiles.

PROCESS:
1. When given a student name, ask 6 key questions one at a time:
   - Overall academic performance and subject strengths/weaknesses
   - Learning style and class engagement
   - Homework habits and behavior
   - Social interactions and emotional patterns
   - Main learning challenges and recent progress
   - Unique strengths and additional observations

2. After gathering responses, provide a comprehensive Hebrew analysis with:
   - Summary (2-3 sentences)
   - Strengths (academic + behavioral/social)
   - Areas for improvement (academic + behavioral/emotional)
   - Action plan (immediate + long-term recommendations)
   - Classroom adaptations (seating, teaching style, materials)
   - Success metrics and follow-up timeline

FORMAT: Use clear Hebrew headers with emojis (📊 💪 🎯 📈 🎓 💡), bullet points, and specific actionable steps.

TONE: Empathetic, strengths-first, growth-oriented, evidence-based. Focus on what the student CAN do and how to build from there.

OUTPUT LANGUAGE: Hebrew only`;

/**
 * Question templates used to gather information about the student.
 * These are asked sequentially during the analysis session.
 */
const QUESTION_TEMPLATES: string[] = [
  'מה הביצועים האקדמיים הכלליים של התלמיד/ה ומהן נקודות החוזק והחולשה בכל מקצוע?',
  'איך התלמיד/ה לומד/ת בכיתה? מהו סגנון הלמידה שלו/ה והאם הוא/היא פעיל/ה בשיעורים?',
  'כיצד התלמיד/ה מתנהג/ת לגבי שיעורי בית והתנהגות כללית?',
  'כיצד התלמיד/ה מתנהג/ת בהקשר החברתי והרגשי בכיתה?',
  'מהם האתגרים העיקריים בלמידה והאם יש התקדמות לאחרונה?',
  'מהן נקודות החוזק הייחודיות של התלמיד/ה והאם יש משהו נוסף שחשוב לציין?',
];

/**
 * Analysis prompt template used after gathering all responses.
 * Instructs the AI to synthesize the information into a comprehensive report.
 */
const ANALYSIS_PROMPT_TEMPLATE = `בהתבסס על כל המידע שנאסף, אנא ספק/י ניתוח מקיף בעברית עם המבנה הבא:

📊 **סיכום כללי** (2-3 משפטים)

💪 **נקודות חוזק**
- אקדמיות:
- התנהגותיות/חברתיות:

🎯 **תחומים לשיפור**
- אקדמיים:
- התנהגותיים/רגשיים:

📈 **תוכנית פעולה**
- המלצות מיידיות:
- המלצות לטווח ארוך:

🎓 **התאמות בכיתה**
- סידור ישיבה:
- סגנון הוראה:
- חומרי לימוד:

💡 **מדדי הצלחה ומעקב**
- יעדים למעקב:
- מועד מעקב מומלץ:`;

/**
 * Interpolate variables in a template string.
 * Replaces placeholders like {variableName} with actual values.
 *
 * @param template - The template string with placeholders
 * @param variables - Object containing variable names and their values
 * @returns The template with variables replaced
 *
 * @example
 * ```typescript
 * interpolateVariables('Hello {name}!', { name: 'John' })
 * // Returns: "Hello John!"
 * ```
 */
function interpolateVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value);
  }
  return result;
}

/**
 * Get the system prompt with student name interpolated.
 * This prompt sets the context for the AI conversation.
 *
 * @param studentName - The name of the student being analyzed
 * @returns The system prompt with the student's name inserted
 *
 * @example
 * ```typescript
 * const prompt = getSystemPrompt('Sarah Levi');
 * // Returns: "You are an expert educational psychologist... [student: Sarah Levi]"
 * ```
 */
export function getSystemPrompt(studentName: string): string {
  return interpolateVariables(SYSTEM_PROMPT_TEMPLATE, { studentName });
}

/**
 * Get the list of question templates to ask about the student.
 * These questions are asked sequentially during the analysis session.
 *
 * @returns Array of 6 Hebrew question templates
 *
 * @example
 * ```typescript
 * const questions = getQuestionTemplates();
 * // Returns: ['מה הביצועים האקדמיים...', ...]
 * ```
 */
export function getQuestionTemplates(): string[] {
  return [...QUESTION_TEMPLATES];
}

/**
 * Get the analysis prompt template.
 * This prompt is used after all questions have been answered to generate
 * the final comprehensive analysis report.
 *
 * @returns The analysis prompt template in Hebrew
 *
 * @example
 * ```typescript
 * const analysisPrompt = getAnalysisPrompt();
 * // Returns: "בהתבסס על כל המידע שנאסף..."
 * ```
 */
export function getAnalysisPrompt(): string {
  return ANALYSIS_PROMPT_TEMPLATE;
}

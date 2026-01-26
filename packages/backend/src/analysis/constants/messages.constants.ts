/**
 * Analysis configuration constants
 */
export const ANALYSIS_CONFIG = {
  /** Maximum number of conversation messages to keep in history */
  MAX_HISTORY_MESSAGES: 15,
  /** Total number of questions in the analysis flow */
  TOTAL_QUESTIONS: 10,
  /** Minimum length for a valid summary */
  MIN_SUMMARY_LENGTH: 50,
} as const;

/**
 * Analysis message templates (Hebrew)
 */
export const ANALYSIS_MESSAGES = {
  /** Greeting message at the start of analysis */
  GREETING:
    'שלום! בואו ננתח את {studentName}. כדי ליצור ניתוח מקיף, אשאל אותך מספר שאלות על התלמיד/ה.',

  /** Question header format */
  QUESTION_HEADER: '**שאלה {current} מתוך {total}:**',

  /** Prefix before next question */
  NEXT_QUESTION_PREFIX: 'תודה על המידע! הנה השאלה הבאה:',

  /** Message when all questions are complete */
  COMPLETE_MESSAGE: `תודה רבה על כל המידע המפורט! יש לי תמונה ברורה של {studentName}.

לחץ/י על כפתור "השלם ניתוח" כדי לקבל ניתוח מקיף עם המלצות ספציפיות לתלמיד/ה.`,

  /** Info message when analysis is complete */
  COMPLETE_INFO: 'תודה רבה על כל המידע המפורט! יש לי תמונה ברורה של {studentName}.',

  /** Instruction when analysis is complete */
  COMPLETE_INSTRUCTION:
    'לחץ/י על כפתור "השלם ניתוח" כדי לקבל ניתוח מקיף עם המלצות ספציפיות ל{studentName}.',

  /** Fallback summary when AI is not available */
  FALLBACK_SUMMARY:
    'ניתוח זה מבוסס על {count} תגובות שנאספו על התלמיד/ה {studentName}. ניתוח מפורט יותר זמין כאשר שירות הבינה המלאכותית פעיל.',

  /** Fallback academic strength */
  FALLBACK_ACADEMIC_STRENGTH: 'מידע לא זמין - נדרש שירות AI פעיל לניתוח מעמיק',

  /** Fallback behavioral strength */
  FALLBACK_BEHAVIORAL_STRENGTH: 'מידע לא זמין - נדרש שירות AI פעיל לניתוח מעמיק',

  /** Fallback academic barrier */
  FALLBACK_ACADEMIC_BARRIER: 'מידע לא זמין - נדרש שירות AI פעיל לניתוח מעמיק',

  /** Fallback behavioral barrier */
  FALLBACK_BEHAVIORAL_BARRIER: 'מידע לא זמין - נדרש שירות AI פעיל לניתוח מעמיק',

  /** Fallback immediate recommendation */
  FALLBACK_IMMEDIATE_REC: 'הפעל את שירות הבינה המלאכותית לקבלת המלצות מותאמות אישית',

  /** Fallback long-term recommendation */
  FALLBACK_LONGTERM_REC: 'צור קשר עם מנהל המערכת להפעלת השירות המלא',

  /** Fallback learning style */
  FALLBACK_LEARNING_STYLE: 'לא ניתן לקבוע ללא שירות AI פעיל',

  /** Fallback tracking metric 1 */
  FALLBACK_TRACKING_METRIC_1: 'מעקב אחר התקדמות כללית',

  /** Fallback tracking metric 2 */
  FALLBACK_TRACKING_METRIC_2: 'מעקב אחר מעורבות בשיעור',
} as const;

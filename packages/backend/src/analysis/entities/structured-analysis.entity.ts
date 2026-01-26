/**
 * Represents the structured analysis output for a student
 * Contains all sections of the pedagogical analysis in a typed format
 */
export interface StructuredAnalysis {
  /** Schema version for forward compatibility */
  schemaVersion: string;

  /** Overall summary of the student analysis */
  summary: string;

  /** Student strengths broken down by category */
  strengths: {
    /** Academic strengths (subjects, skills, etc.) */
    academic: string[];
    /** Behavioral strengths (attitude, participation, etc.) */
    behavioral: string[];
  };

  /** Student barriers/challenges broken down by category */
  barriers: {
    /** Academic challenges */
    academic: string[];
    /** Behavioral challenges */
    behavioral: string[];
  };

  /** Recommendations for the student */
  recommendations: {
    /** Immediate actionable recommendations */
    immediate: string[];
    /** Long-term development recommendations */
    longTerm: string[];
  };

  /** Learning style analysis */
  learningStyle: {
    /** Learning preferences description */
    preferences: string;
  };

  /** Goals and tracking metrics */
  goals: {
    /** Metrics to track student progress */
    trackingMetrics: string[];
  };

  /** Full text narrative of the analysis (optional) */
  fullText?: string;
}

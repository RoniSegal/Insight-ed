/**
 * Unit tests for Prompts Service
 *
 * Tests the prompts service that provides AI prompts for student analysis.
 * Ensures prompts are correctly formatted and variables are properly interpolated.
 */

import { getSystemPrompt, getQuestionTemplates, getAnalysisPrompt } from '@/app/api/lib/prompts';

describe('Prompts Service', () => {
  describe('getSystemPrompt', () => {
    it('should return a system prompt with student name', () => {
      const studentName = 'David Cohen';
      const prompt = getSystemPrompt(studentName);

      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(100);
    });

    it('should include educational psychologist role definition', () => {
      const prompt = getSystemPrompt('Test Student');

      expect(prompt).toContain('educational psychologist');
      expect(prompt).toContain('K-12');
    });

    it('should include process instructions', () => {
      const prompt = getSystemPrompt('Test Student');

      expect(prompt).toContain('PROCESS:');
      expect(prompt).toContain('6 key questions');
    });

    it('should include output format requirements', () => {
      const prompt = getSystemPrompt('Test Student');

      expect(prompt).toContain('FORMAT:');
      expect(prompt).toContain('Hebrew');
    });

    it('should include tone guidance', () => {
      const prompt = getSystemPrompt('Test Student');

      expect(prompt).toContain('TONE:');
      expect(prompt).toContain('Empathetic');
    });

    it('should specify Hebrew output language', () => {
      const prompt = getSystemPrompt('Test Student');

      expect(prompt).toContain('OUTPUT LANGUAGE');
      expect(prompt).toContain('Hebrew only');
    });

    it('should handle student names with special characters', () => {
      const studentName = "O'Brien-Cohen";
      const prompt = getSystemPrompt(studentName);

      expect(prompt).toBeTruthy();
      expect(prompt.length).toBeGreaterThan(100);
    });

    it('should handle Hebrew student names', () => {
      const studentName = 'דוד כהן';
      const prompt = getSystemPrompt(studentName);

      expect(prompt).toBeTruthy();
      expect(prompt.length).toBeGreaterThan(100);
    });
  });

  describe('getQuestionTemplates', () => {
    it('should return an array of question templates', () => {
      const questions = getQuestionTemplates();

      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should return exactly 6 question templates', () => {
      const questions = getQuestionTemplates();

      expect(questions.length).toBe(6);
    });

    it('should return questions in Hebrew', () => {
      const questions = getQuestionTemplates();

      questions.forEach((question) => {
        expect(typeof question).toBe('string');
        expect(question.length).toBeGreaterThan(10);
        // Check for Hebrew characters
        expect(/[\u0590-\u05FF]/.test(question)).toBe(true);
      });
    });

    it('should return a new array (not reference)', () => {
      const questions1 = getQuestionTemplates();
      const questions2 = getQuestionTemplates();

      expect(questions1).toEqual(questions2);
      expect(questions1).not.toBe(questions2); // Different array instances
    });

    it('should have distinct questions', () => {
      const questions = getQuestionTemplates();
      const uniqueQuestions = new Set(questions);

      expect(uniqueQuestions.size).toBe(questions.length);
    });

    it('should cover academic performance topic', () => {
      const questions = getQuestionTemplates();
      const hasAcademicQuestion = questions.some((q) => q.includes('אקדמי'));

      expect(hasAcademicQuestion).toBe(true);
    });

    it('should cover learning style topic', () => {
      const questions = getQuestionTemplates();
      const hasLearningStyleQuestion = questions.some((q) => q.includes('למיד') || q.includes('סגנון'));

      expect(hasLearningStyleQuestion).toBe(true);
    });

    it('should cover behavioral topic', () => {
      const questions = getQuestionTemplates();
      const hasBehaviorQuestion = questions.some((q) => q.includes('התנהג'));

      expect(hasBehaviorQuestion).toBe(true);
    });

    it('should cover social/emotional topic', () => {
      const questions = getQuestionTemplates();
      const hasSocialQuestion = questions.some((q) => q.includes('חברת') || q.includes('רגש'));

      expect(hasSocialQuestion).toBe(true);
    });

    it('should cover challenges topic', () => {
      const questions = getQuestionTemplates();
      const hasChallengesQuestion = questions.some((q) => q.includes('אתגר'));

      expect(hasChallengesQuestion).toBe(true);
    });

    it('should cover strengths topic', () => {
      const questions = getQuestionTemplates();
      const hasStrengthsQuestion = questions.some((q) => q.includes('חוזק'));

      expect(hasStrengthsQuestion).toBe(true);
    });
  });

  describe('getAnalysisPrompt', () => {
    it('should return analysis prompt template', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(100);
    });

    it('should be in Hebrew', () => {
      const prompt = getAnalysisPrompt();

      // Check for Hebrew characters
      expect(/[\u0590-\u05FF]/.test(prompt)).toBe(true);
    });

    it('should include summary section with emoji', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('📊');
      expect(prompt).toContain('סיכום');
    });

    it('should include strengths section with emoji', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('💪');
      expect(prompt).toContain('חוזק');
    });

    it('should include areas for improvement section with emoji', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('🎯');
      expect(prompt).toContain('שיפור');
    });

    it('should include action plan section with emoji', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('📈');
      expect(prompt).toContain('תוכנית');
    });

    it('should include classroom adaptations section with emoji', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('🎓');
      expect(prompt).toContain('התאמות');
    });

    it('should include success metrics section with emoji', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('💡');
      expect(prompt).toContain('מדדי');
    });

    it('should request academic strengths subsection', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('אקדמיות');
    });

    it('should request behavioral strengths subsection', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('התנהגותיות');
    });

    it('should request immediate recommendations', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('מיידיות');
    });

    it('should request long-term recommendations', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('טווח ארוך');
    });

    it('should request seating arrangements', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('ישיבה');
    });

    it('should request teaching style adaptations', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('הוראה');
    });

    it('should request learning materials adaptations', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('חומרי');
    });

    it('should request success metrics', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('יעדים');
    });

    it('should request follow-up timeline', () => {
      const prompt = getAnalysisPrompt();

      expect(prompt).toContain('מעקב');
    });
  });
});

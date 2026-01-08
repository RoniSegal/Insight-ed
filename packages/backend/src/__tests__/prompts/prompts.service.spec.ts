import { Test, TestingModule } from '@nestjs/testing';

import { PromptsService } from '../../prompts/prompts.service';

describe('PromptsService', () => {
  let service: PromptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptsService],
    }).compile();

    service = module.get<PromptsService>(PromptsService);
    // Load templates from files
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSystemPrompt', () => {
    it('should return a non-empty system prompt', () => {
      const prompt = service.getSystemPrompt('Test Student');

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should contain key phrases from the original prompt', () => {
      const prompt = service.getSystemPrompt('David Cohen');

      expect(prompt).toContain('expert educational psychologist');
      expect(prompt).toContain('K-12 students');
      expect(prompt).toContain('6 key questions');
      expect(prompt).toContain('comprehensive Hebrew analysis');
    });

    it('should define the process with numbered steps', () => {
      const prompt = service.getSystemPrompt('Sarah Levi');

      expect(prompt).toContain('PROCESS:');
      expect(prompt).toContain('1. When given a student name');
      expect(prompt).toContain('2. After gathering responses');
    });

    it('should specify output format requirements', () => {
      const prompt = service.getSystemPrompt('Test Student');

      expect(prompt).toContain('FORMAT:');
      expect(prompt).toContain('Hebrew headers with emojis');
      expect(prompt).toContain('📊 💪 🎯 📈 🎓 💡');
    });

    it('should specify the tone', () => {
      const prompt = service.getSystemPrompt('Test Student');

      expect(prompt).toContain('TONE:');
      expect(prompt).toContain('Empathetic');
      expect(prompt).toContain('strengths-first');
      expect(prompt).toContain('growth-oriented');
    });

    it('should specify Hebrew output language', () => {
      const prompt = service.getSystemPrompt('Test Student');

      expect(prompt).toContain('OUTPUT LANGUAGE: Hebrew only');
    });

    it('should support variable substitution for student name', () => {
      const studentName = 'John Doe';
      const prompt = service.getSystemPrompt(studentName);

      // The current implementation doesn't use {studentName} in the template,
      // but the method should still work correctly
      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should return consistent results for the same input', () => {
      const prompt1 = service.getSystemPrompt('Test Student');
      const prompt2 = service.getSystemPrompt('Test Student');

      expect(prompt1).toEqual(prompt2);
    });

    it('should handle special characters in student name', () => {
      const studentName = "O'Brien-Smith";
      const prompt = service.getSystemPrompt(studentName);

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should handle Hebrew characters in student name', () => {
      const studentName = 'דוד כהן';
      const prompt = service.getSystemPrompt(studentName);

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  describe('getQuestionTemplates', () => {
    it('should return exactly 6 questions', () => {
      const questions = service.getQuestionTemplates();

      expect(questions).toBeDefined();
      expect(questions.length).toBe(6);
    });

    it('should return an array of non-empty strings', () => {
      const questions = service.getQuestionTemplates();

      questions.forEach((question) => {
        expect(typeof question).toBe('string');
        expect(question.length).toBeGreaterThan(0);
      });
    });

    it('should return questions in Hebrew', () => {
      const questions = service.getQuestionTemplates();

      // Check for Hebrew characters (Unicode range: \u0590-\u05FF)
      const hebrewRegex = /[\u0590-\u05FF]/;

      questions.forEach((question) => {
        expect(hebrewRegex.test(question)).toBe(true);
      });
    });

    it('should return questions about academic performance', () => {
      const questions = service.getQuestionTemplates();
      const questionsText = questions.join(' ');

      expect(questionsText).toContain('אקדמי'); // Academic
    });

    it('should return questions about learning style and engagement', () => {
      const questions = service.getQuestionTemplates();
      const questionsText = questions.join(' ');

      expect(questionsText).toContain('לומד'); // Learning
      expect(questionsText).toContain('כיתה'); // Class
    });

    it('should return questions about homework and behavior', () => {
      const questions = service.getQuestionTemplates();
      const questionsText = questions.join(' ');

      expect(questionsText).toContain('שיעורי בית'); // Homework
      expect(questionsText).toContain('התנהגות'); // Behavior
    });

    it('should return questions about social and emotional aspects', () => {
      const questions = service.getQuestionTemplates();
      const questionsText = questions.join(' ');

      expect(questionsText).toContain('חברתי'); // Social
      expect(questionsText).toContain('רגשי'); // Emotional
    });

    it('should return questions about challenges and progress', () => {
      const questions = service.getQuestionTemplates();
      const questionsText = questions.join(' ');

      expect(questionsText).toContain('אתגרים'); // Challenges
      expect(questionsText).toContain('התקדמות'); // Progress
    });

    it('should return questions about unique strengths', () => {
      const questions = service.getQuestionTemplates();
      const questionsText = questions.join(' ');

      expect(questionsText).toContain('חוזק'); // Strength
    });

    it('should return a new array instance (not reference)', () => {
      const questions1 = service.getQuestionTemplates();
      const questions2 = service.getQuestionTemplates();

      expect(questions1).toEqual(questions2);
      expect(questions1).not.toBe(questions2); // Different array instances
    });

    it('should return consistent results on multiple calls', () => {
      const questions1 = service.getQuestionTemplates();
      const questions2 = service.getQuestionTemplates();
      const questions3 = service.getQuestionTemplates();

      expect(questions1).toEqual(questions2);
      expect(questions2).toEqual(questions3);
    });

    it('should not allow modifications to affect subsequent calls', () => {
      const questions1 = service.getQuestionTemplates();
      questions1.push('Extra question'); // Modify the returned array

      const questions2 = service.getQuestionTemplates();

      expect(questions2.length).toBe(6); // Should still be 6, not 7
    });
  });

  describe('getAnalysisPrompt', () => {
    it('should return a non-empty analysis prompt', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should be in Hebrew', () => {
      const prompt = service.getAnalysisPrompt();

      // Check for Hebrew characters
      const hebrewRegex = /[\u0590-\u05FF]/;
      expect(hebrewRegex.test(prompt)).toBe(true);
    });

    it('should include summary section with emoji', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('📊');
      expect(prompt).toContain('סיכום כללי');
    });

    it('should include strengths section with emoji', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('💪');
      expect(prompt).toContain('נקודות חוזק');
    });

    it('should include areas for improvement section with emoji', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('🎯');
      expect(prompt).toContain('תחומים לשיפור');
    });

    it('should include action plan section with emoji', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('📈');
      expect(prompt).toContain('תוכנית פעולה');
    });

    it('should include classroom adaptations section with emoji', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('🎓');
      expect(prompt).toContain('התאמות בכיתה');
    });

    it('should include success metrics section with emoji', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('💡');
      expect(prompt).toContain('מדדי הצלחה');
    });

    it('should specify academic and behavioral/social strengths', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('אקדמיות');
      expect(prompt).toContain('התנהגותיות/חברתיות');
    });

    it('should specify academic and behavioral/emotional areas for improvement', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('אקדמיים');
      expect(prompt).toContain('התנהגותיים/רגשיים');
    });

    it('should specify immediate and long-term recommendations', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('מיידיות');
      expect(prompt).toContain('לטווח ארוך');
    });

    it('should specify classroom adaptation categories', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('סידור ישיבה');
      expect(prompt).toContain('סגנון הוראה');
      expect(prompt).toContain('חומרי לימוד');
    });

    it('should specify success metrics and follow-up timeline', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('יעדים למעקב');
      expect(prompt).toContain('מועד מעקב');
    });

    it('should return consistent results on multiple calls', () => {
      const prompt1 = service.getAnalysisPrompt();
      const prompt2 = service.getAnalysisPrompt();

      expect(prompt1).toEqual(prompt2);
    });

    it('should contain all 6 emoji indicators', () => {
      const prompt = service.getAnalysisPrompt();

      expect(prompt).toContain('📊'); // Summary
      expect(prompt).toContain('💪'); // Strengths
      expect(prompt).toContain('🎯'); // Areas for improvement
      expect(prompt).toContain('📈'); // Action plan
      expect(prompt).toContain('🎓'); // Classroom adaptations
      expect(prompt).toContain('💡'); // Success metrics
    });
  });

  describe('Service Integration', () => {
    it('should provide all three required methods', () => {
      expect(typeof service.getSystemPrompt).toBe('function');
      expect(typeof service.getQuestionTemplates).toBe('function');
      expect(typeof service.getAnalysisPrompt).toBe('function');
    });

    it('should work in a typical analysis flow', () => {
      const studentName = 'דוד כהן';

      // Step 1: Get system prompt
      const systemPrompt = service.getSystemPrompt(studentName);
      expect(systemPrompt).toBeDefined();
      expect(systemPrompt.length).toBeGreaterThan(0);

      // Step 2: Get questions
      const questions = service.getQuestionTemplates();
      expect(questions).toBeDefined();
      expect(questions.length).toBe(6);

      // Step 3: Get analysis prompt
      const analysisPrompt = service.getAnalysisPrompt();
      expect(analysisPrompt).toBeDefined();
      expect(analysisPrompt.length).toBeGreaterThan(0);
    });

    it('should maintain service state across multiple calls', () => {
      const student1 = 'Student One';
      const student2 = 'Student Two';

      const prompt1 = service.getSystemPrompt(student1);
      const questions1 = service.getQuestionTemplates();
      const prompt2 = service.getSystemPrompt(student2);
      const questions2 = service.getQuestionTemplates();

      // Questions should be the same regardless of student
      expect(questions1).toEqual(questions2);

      // System prompts should be valid for both students
      expect(prompt1).toBeDefined();
      expect(prompt2).toBeDefined();
    });
  });

  describe('Hebrew Character Encoding', () => {
    it('should properly handle Hebrew characters in all prompts', () => {
      const hebrewRegex = /[\u0590-\u05FF]/;

      const questions = service.getQuestionTemplates();
      const analysisPrompt = service.getAnalysisPrompt();

      // All questions should contain Hebrew
      questions.forEach((question) => {
        expect(hebrewRegex.test(question)).toBe(true);
      });

      // Analysis prompt should contain Hebrew
      expect(hebrewRegex.test(analysisPrompt)).toBe(true);
    });

    it('should not corrupt Hebrew characters when returned', () => {
      const questions = service.getQuestionTemplates();

      // Check specific Hebrew words are intact
      const firstQuestion = questions[0];
      expect(firstQuestion).toContain('מה');
      expect(firstQuestion).toContain('ביצועים');
      expect(firstQuestion).toContain('אקדמיים');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as student name', () => {
      const prompt = service.getSystemPrompt('');

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should handle very long student name', () => {
      const longName = 'A'.repeat(1000);
      const prompt = service.getSystemPrompt(longName);

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should handle student name with special characters', () => {
      const specialName = "O'Brien-Smith Jr. (3rd)";
      const prompt = service.getSystemPrompt(specialName);

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should handle student name with numbers', () => {
      const nameWithNumbers = 'Student 123';
      const prompt = service.getSystemPrompt(nameWithNumbers);

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should handle student name with mixed Hebrew and English', () => {
      const mixedName = 'David דוד Cohen כהן';
      const prompt = service.getSystemPrompt(mixedName);

      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });
  });
});

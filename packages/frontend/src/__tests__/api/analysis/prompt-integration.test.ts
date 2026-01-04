/**
 * Integration tests for Prompts Service Integration
 *
 * Tests that verify:
 * - System prompts are loaded from prompts service (not files)
 * - System prompt is stored in conversation for auditability
 * - Question templates are properly formatted
 * - No file system access occurs
 * - Conversation flow properly uses prompts service
 */

import { setConversation, getConversation, type ConversationState } from '@/app/api/lib/conversationStore';
import { getSystemPrompt, getQuestionTemplates, getAnalysisPrompt } from '@/app/api/lib/prompts';
import { randomUUID } from 'crypto';

// Spy on fs module to ensure no file access
const fsReadSpy = jest.spyOn(require('fs'), 'readFileSync');

describe('Prompts Service - Conversation Integration', () => {
  const mockStudentId = 'student-123';
  const mockStudentName = 'David Cohen';

  beforeEach(() => {
    jest.clearAllMocks();
    fsReadSpy.mockClear();
  });

  afterAll(() => {
    fsReadSpy.mockRestore();
  });

  describe('Conversation Initialization', () => {
    it('should create conversation with system prompt from prompts service', () => {
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt, // Store for auditability
        messages: [{ role: 'system', content: systemPrompt }],
        questionCount: 0,
        isComplete: false,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      const retrieved = getConversation(conversationId);
      expect(retrieved).toBeTruthy();
      expect(retrieved?.systemPrompt).toBe(systemPrompt);
      expect(retrieved?.systemPrompt).toContain('educational psychologist');
    });

    it('should include system message in messages array', () => {
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt,
        messages: [{ role: 'system', content: systemPrompt }],
        questionCount: 0,
        isComplete: false,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      const retrieved = getConversation(conversationId);
      const systemMessage = retrieved?.messages.find((m) => m.role === 'system');

      expect(systemMessage).toBeTruthy();
      expect(systemMessage?.content).toBe(systemPrompt);
    });

    it('should not access file system when using prompts service', () => {
      const systemPrompt = getSystemPrompt(mockStudentName);
      const questions = getQuestionTemplates();
      const analysisPrompt = getAnalysisPrompt();

      expect(systemPrompt).toBeTruthy();
      expect(questions.length).toBe(6);
      expect(analysisPrompt).toBeTruthy();

      // Verify no file system reads occurred
      expect(fsReadSpy).not.toHaveBeenCalled();
    });
  });

  describe('Message History Management', () => {
    it('should maintain system prompt at start of messages array', () => {
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt,
        messages: [{ role: 'system', content: systemPrompt }],
        questionCount: 0,
        isComplete: false,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      // Add user and assistant messages
      conversation.messages.push({ role: 'user', content: 'הוא מצטיין במתמטיקה' });
      conversation.messages.push({ role: 'assistant', content: 'תודה! ספר לי עוד' });
      conversation.questionCount++;

      setConversation(conversationId, conversation);

      const retrieved = getConversation(conversationId);
      expect(retrieved?.messages.length).toBe(3);
      expect(retrieved?.messages[0].role).toBe('system');
      expect(retrieved?.messages[0].content).toBe(systemPrompt);
    });

    it('should preserve system prompt through conversation flow', () => {
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt,
        messages: [{ role: 'system', content: systemPrompt }],
        questionCount: 0,
        isComplete: false,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      // Simulate multiple message exchanges
      for (let i = 0; i < 6; i++) {
        conversation.messages.push({ role: 'user', content: `תשובה ${i + 1}` });
        conversation.messages.push({ role: 'assistant', content: `שאלה ${i + 2}` });
        conversation.questionCount++;
      }

      conversation.isComplete = true;
      setConversation(conversationId, conversation);

      const retrieved = getConversation(conversationId);
      expect(retrieved?.systemPrompt).toBe(systemPrompt);
      expect(retrieved?.isComplete).toBe(true);
      expect(retrieved?.questionCount).toBe(6);
      expect(retrieved?.messages[0].role).toBe('system');
    });
  });

  describe('Template Questions Integration', () => {
    it('should provide 6 question templates for fallback mode', () => {
      const templates = getQuestionTemplates();

      expect(templates.length).toBe(6);
      templates.forEach((template) => {
        expect(typeof template).toBe('string');
        expect(template.length).toBeGreaterThan(0);
      });

      // No file access should occur
      expect(fsReadSpy).not.toHaveBeenCalled();
    });

    it('should support template variable replacement', () => {
      const templates = getQuestionTemplates();
      const studentName = 'Sarah Levi';

      const processedTemplates = templates.map((template) =>
        template.replace(/{studentName}/g, studentName)
      );

      processedTemplates.forEach((processed) => {
        expect(processed).not.toContain('{studentName}');
        // Hebrew questions should contain Hebrew characters or be generic
        expect(processed.length).toBeGreaterThan(10);
      });
    });

    it('should use templates in conversation flow', () => {
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);
      const templates = getQuestionTemplates();

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt,
        messages: [{ role: 'system', content: systemPrompt }],
        questionCount: 0,
        isComplete: false,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      // Simulate using templates for questions
      for (let i = 0; i < templates.length; i++) {
        const question = templates[i];
        conversation.messages.push({ role: 'user', content: `תשובה ${i + 1}` });
        conversation.messages.push({ role: 'assistant', content: question });
        conversation.questionCount++;
        setConversation(conversationId, conversation);
      }

      const retrieved = getConversation(conversationId);
      expect(retrieved?.questionCount).toBe(6);
      expect(retrieved?.messages.length).toBeGreaterThan(6);

      // Verify no file access
      expect(fsReadSpy).not.toHaveBeenCalled();
    });
  });

  describe('Analysis Prompt Integration', () => {
    it('should provide analysis prompt for final synthesis', () => {
      const analysisPrompt = getAnalysisPrompt();

      expect(analysisPrompt).toBeTruthy();
      expect(analysisPrompt).toContain('📊');
      expect(analysisPrompt).toContain('💪');
      expect(analysisPrompt).toContain('🎯');
      expect(analysisPrompt).toContain('📈');
      expect(analysisPrompt).toContain('🎓');
      expect(analysisPrompt).toContain('💡');

      // No file access
      expect(fsReadSpy).not.toHaveBeenCalled();
    });

    it('should use analysis prompt in completed conversation', () => {
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);
      const analysisPrompt = getAnalysisPrompt();

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'תשובה 1' },
          { role: 'assistant', content: 'שאלה 2' },
          // ... more exchanges ...
          { role: 'user', content: analysisPrompt },
          {
            role: 'assistant',
            content: `📊 ניתוח מקיף עבור ${mockStudentName}\n\n💪 נקודות חוזק:\n- מצטיין במתמטיקה`,
          },
        ],
        questionCount: 6,
        isComplete: true,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      const retrieved = getConversation(conversationId);
      expect(retrieved?.isComplete).toBe(true);
      expect(retrieved?.messages.some((m) => m.content.includes('📊'))).toBe(true);

      // Verify system prompt is still available for audit
      expect(retrieved?.systemPrompt).toBe(systemPrompt);
    });
  });

  describe('No File System Access Guarantee', () => {
    it('should never call fs.readFileSync during full conversation lifecycle', () => {
      // Initialize conversation
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt,
        messages: [{ role: 'system', content: systemPrompt }],
        questionCount: 0,
        isComplete: false,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      // Get question templates
      const templates = getQuestionTemplates();

      // Simulate conversation exchanges
      templates.forEach((template, i) => {
        conversation.messages.push({ role: 'user', content: `תשובה ${i + 1}` });
        conversation.messages.push({ role: 'assistant', content: template });
        conversation.questionCount++;
        setConversation(conversationId, conversation);
      });

      // Get analysis prompt
      const analysisPrompt = getAnalysisPrompt();
      conversation.messages.push({ role: 'user', content: analysisPrompt });
      conversation.messages.push({
        role: 'assistant',
        content: '📊 ניתוח מקיף\n\n💪 נקודות חוזק',
      });
      conversation.isComplete = true;
      setConversation(conversationId, conversation);

      // Retrieve final conversation
      const final = getConversation(conversationId);

      // Verify everything worked
      expect(final?.isComplete).toBe(true);
      expect(final?.questionCount).toBe(6);
      expect(final?.systemPrompt).toBeTruthy();

      // CRITICAL: Verify NO file system access occurred
      expect(fsReadSpy).not.toHaveBeenCalled();
    });

    it('should work in containerized environment without file access', () => {
      // This test ensures the system works without /context/chat-prompt-simple.txt

      // Mock file system to throw error (simulating file not found)
      fsReadSpy.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      // System should still work using prompts service
      const systemPrompt = getSystemPrompt(mockStudentName);
      const templates = getQuestionTemplates();
      const analysisPrompt = getAnalysisPrompt();

      expect(systemPrompt).toBeTruthy();
      expect(templates.length).toBe(6);
      expect(analysisPrompt).toBeTruthy();

      // File system was never called (we're using prompts service)
      expect(fsReadSpy).not.toHaveBeenCalled();
    });
  });

  describe('Auditability', () => {
    it('should store which prompt version was used', () => {
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt, // Stored for audit trail
        messages: [{ role: 'system', content: systemPrompt }],
        questionCount: 0,
        isComplete: false,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      const retrieved = getConversation(conversationId);

      // Verify we can audit which prompt was used
      expect(retrieved?.systemPrompt).toBe(systemPrompt);
      expect(retrieved?.systemPrompt).toContain('educational psychologist');
      expect(retrieved?.createdAt).toBeInstanceOf(Date);
    });

    it('should maintain prompt consistency throughout conversation', () => {
      const conversationId = randomUUID();
      const systemPrompt = getSystemPrompt(mockStudentName);
      const initialPromptCopy = systemPrompt; // Save initial value

      const conversation: ConversationState = {
        id: conversationId,
        studentId: mockStudentId,
        studentName: mockStudentName,
        systemPrompt,
        messages: [{ role: 'system', content: systemPrompt }],
        questionCount: 0,
        isComplete: false,
        createdAt: new Date(),
      };

      setConversation(conversationId, conversation);

      // Add many messages
      for (let i = 0; i < 10; i++) {
        conversation.messages.push({ role: 'user', content: `הודעה ${i}` });
        conversation.messages.push({ role: 'assistant', content: `תשובה ${i}` });
        setConversation(conversationId, conversation);
      }

      const retrieved = getConversation(conversationId);

      // System prompt should remain unchanged
      expect(retrieved?.systemPrompt).toBe(initialPromptCopy);
    });
  });
});

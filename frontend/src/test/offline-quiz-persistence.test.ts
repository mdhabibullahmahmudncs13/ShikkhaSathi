import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { offlineStorage, OfflineQuizAttempt } from '../services/offlineStorage';

/**
 * **Feature: shikkhasathi-platform, Property 11: Offline Quiz Persistence**
 * **Validates: Requirements 4.2**
 * 
 * For any quiz taken while offline, the attempt should be saved locally and remain accessible until connectivity is restored
 */

describe('Offline Quiz Persistence Properties', () => {
  beforeEach(async () => {
    // Clear database before each test
    await offlineStorage.clearAllData();
  });

  afterEach(async () => {
    // Clean up after each test
    await offlineStorage.clearAllData();
  });

  it('should persist any quiz attempt taken offline and keep it accessible', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary quiz attempt data
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 50 }),
          userId: fc.string({ minLength: 1, maxLength: 50 }),
          quizId: fc.string({ minLength: 1, maxLength: 50 }),
          subject: fc.constantFrom('Physics', 'Chemistry', 'Mathematics', 'Biology', 'Bangla', 'English'),
          topic: fc.string({ minLength: 1, maxLength: 100 }),
          questions: fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 50 }),
              question: fc.string({ minLength: 10, maxLength: 500 }),
              options: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 2, maxLength: 4 }),
              correctAnswer: fc.integer({ min: 0, max: 3 }),
              userAnswer: fc.option(fc.integer({ min: 0, max: 3 })),
              bloomLevel: fc.integer({ min: 1, max: 6 })
            }),
            { minLength: 1, maxLength: 20 }
          ),
          score: fc.option(fc.integer({ min: 0, max: 100 })),
          maxScore: fc.integer({ min: 1, max: 100 }),
          timeTaken: fc.option(fc.integer({ min: 1, max: 3600 })),
          difficultyLevel: fc.integer({ min: 1, max: 5 }),
          completedAt: fc.option(fc.date()),
          synced: fc.boolean(),
          createdAt: fc.date()
        }),
        async (quizData) => {
          // Arrange: Create quiz attempt with proper structure
          const quizAttempt: OfflineQuizAttempt = {
            ...quizData,
            questions: quizData.questions.map(q => ({
              ...q,
              correctAnswer: Math.min(q.correctAnswer, q.options.length - 1),
              userAnswer: q.userAnswer !== null && q.userAnswer !== undefined 
                ? Math.min(q.userAnswer, q.options.length - 1) 
                : undefined
            }))
          };

          // Act: Save quiz attempt offline
          await offlineStorage.saveQuizAttempt(quizAttempt);

          // Assert: Quiz attempt should be retrievable
          const retrievedAttempt = await offlineStorage.getQuizAttempt(quizAttempt.id);
          
          expect(retrievedAttempt).toBeDefined();
          expect(retrievedAttempt!.id).toBe(quizAttempt.id);
          expect(retrievedAttempt!.userId).toBe(quizAttempt.userId);
          expect(retrievedAttempt!.quizId).toBe(quizAttempt.quizId);
          expect(retrievedAttempt!.subject).toBe(quizAttempt.subject);
          expect(retrievedAttempt!.topic).toBe(quizAttempt.topic);
          expect(retrievedAttempt!.questions).toHaveLength(quizAttempt.questions.length);
          expect(retrievedAttempt!.maxScore).toBe(quizAttempt.maxScore);
          expect(retrievedAttempt!.difficultyLevel).toBe(quizAttempt.difficultyLevel);
          expect(retrievedAttempt!.synced).toBe(quizAttempt.synced);
        }
      ),
      { numRuns: 100 }
    );
  });
});
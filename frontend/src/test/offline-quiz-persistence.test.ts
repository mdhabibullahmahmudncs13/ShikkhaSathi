import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { offlineStorage, OfflineQuizAttempt } from '../services/offlineStorage';

describe('Offline Quiz Persistence Properties', () => {
  beforeEach(async () => {
    await offlineStorage.clearAllData();
  });

  afterEach(async () => {
    await offlineStorage.clearAllData();
  });

  it('should persist quiz attempts taken offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 50 }),
          userId: fc.string({ minLength: 1, maxLength: 50 }),
          quizId: fc.string({ minLength: 1, maxLength: 50 }),
          subject: fc.constantFrom('Physics', 'Chemistry', 'Mathematics'),
          topic: fc.string({ minLength: 1, maxLength: 100 }),
          questions: fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 50 }),
              question: fc.string({ minLength: 10, maxLength: 200 }),
              options: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 2, maxLength: 4 }),
              correctAnswer: fc.integer({ min: 0, max: 3 }),
              userAnswer: fc.option(fc.integer({ min: 0, max: 3 }), { nil: undefined }),
              bloomLevel: fc.integer({ min: 1, max: 6 })
            }),
            { minLength: 1, maxLength: 10 }
          ),
          score: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
          maxScore: fc.integer({ min: 1, max: 100 }),
          timeTaken: fc.option(fc.integer({ min: 1, max: 3600 }), { nil: undefined }),
          difficultyLevel: fc.integer({ min: 1, max: 5 }),
          completedAt: fc.option(fc.date(), { nil: undefined }),
          synced: fc.boolean(),
          createdAt: fc.date()
        }),
        async (quizData) => {
          const quizAttempt: OfflineQuizAttempt = {
            ...quizData,
            questions: quizData.questions.map(q => ({
              ...q,
              correctAnswer: Math.min(q.correctAnswer, q.options.length - 1),
              userAnswer: q.userAnswer !== undefined ? Math.min(q.userAnswer, q.options.length - 1) : undefined
            }))
          };

          await offlineStorage.saveQuizAttempt(quizAttempt);
          const retrieved = await offlineStorage.getQuizAttempt(quizAttempt.id);
          
          expect(retrieved).toBeDefined();
          expect(retrieved.id).toBe(quizAttempt.id);
          expect(retrieved.userId).toBe(quizAttempt.userId);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should track unsynced quiz attempts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            userId: fc.string({ minLength: 1, maxLength: 50 }),
            quizId: fc.string({ minLength: 1, maxLength: 50 }),
            subject: fc.constantFrom('Physics', 'Chemistry', 'Mathematics'),
            topic: fc.string({ minLength: 1, maxLength: 100 }),
            questions: fc.array(
              fc.record({
                id: fc.string({ minLength: 1, maxLength: 50 }),
                question: fc.string({ minLength: 10, maxLength: 200 }),
                options: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 2, maxLength: 4 }),
                correctAnswer: fc.integer({ min: 0, max: 3 }),
                userAnswer: fc.option(fc.integer({ min: 0, max: 3 }), { nil: undefined }),
                bloomLevel: fc.integer({ min: 1, max: 6 })
              }),
              { minLength: 1, maxLength: 5 }
            ),
            score: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
            maxScore: fc.integer({ min: 1, max: 100 }),
            timeTaken: fc.option(fc.integer({ min: 1, max: 3600 }), { nil: undefined }),
            difficultyLevel: fc.integer({ min: 1, max: 5 }),
            completedAt: fc.option(fc.date(), { nil: undefined }),
            synced: fc.boolean(),
            createdAt: fc.date()
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (quizAttemptsData) => {
          const quizAttempts: OfflineQuizAttempt[] = quizAttemptsData.map(data => ({
            ...data,
            questions: data.questions.map(q => ({
              ...q,
              correctAnswer: Math.min(q.correctAnswer, q.options.length - 1),
              userAnswer: q.userAnswer !== undefined ? Math.min(q.userAnswer, q.options.length - 1) : undefined
            }))
          }));

          for (const attempt of quizAttempts) {
            await offlineStorage.saveQuizAttempt(attempt);
          }

          const unsyncedAttempts = await offlineStorage.getUnsyncedQuizAttempts();
          const expectedCount = quizAttempts.filter(a => !a.synced).length;
          expect(unsyncedAttempts.length).toBe(expectedCount);
          
          for (const attempt of unsyncedAttempts) {
            expect(attempt.synced).toBe(false);
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should mark quiz attempts as synced', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 50 }),
          userId: fc.string({ minLength: 1, maxLength: 50 }),
          quizId: fc.string({ minLength: 1, maxLength: 50 }),
          subject: fc.constantFrom('Physics', 'Chemistry', 'Mathematics'),
          topic: fc.string({ minLength: 1, maxLength: 100 }),
          questions: fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 50 }),
              question: fc.string({ minLength: 10, maxLength: 200 }),
              options: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 2, maxLength: 4 }),
              correctAnswer: fc.integer({ min: 0, max: 3 }),
              userAnswer: fc.option(fc.integer({ min: 0, max: 3 }), { nil: undefined }),
              bloomLevel: fc.integer({ min: 1, max: 6 })
            }),
            { minLength: 1, maxLength: 5 }
          ),
          score: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
          maxScore: fc.integer({ min: 1, max: 100 }),
          timeTaken: fc.option(fc.integer({ min: 1, max: 3600 }), { nil: undefined }),
          difficultyLevel: fc.integer({ min: 1, max: 5 }),
          completedAt: fc.option(fc.date(), { nil: undefined }),
          synced: fc.constant(false),
          createdAt: fc.date()
        }),
        async (quizData) => {
          const quizAttempt: OfflineQuizAttempt = {
            ...quizData,
            questions: quizData.questions.map(q => ({
              ...q,
              correctAnswer: Math.min(q.correctAnswer, q.options.length - 1),
              userAnswer: q.userAnswer !== undefined ? Math.min(q.userAnswer, q.options.length - 1) : undefined
            }))
          };

          await offlineStorage.saveQuizAttempt(quizAttempt);
          await offlineStorage.markQuizAttemptSynced(quizAttempt.id);

          const retrieved = await offlineStorage.getQuizAttempt(quizAttempt.id);
          expect(retrieved.synced).toBe(true);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should retrieve quiz attempts by user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            userId: fc.string({ minLength: 1, maxLength: 50 }),
            quizId: fc.string({ minLength: 1, maxLength: 50 }),
            subject: fc.constantFrom('Physics', 'Chemistry', 'Mathematics'),
            topic: fc.string({ minLength: 1, maxLength: 100 }),
            questions: fc.array(
              fc.record({
                id: fc.string({ minLength: 1, maxLength: 50 }),
                question: fc.string({ minLength: 10, maxLength: 200 }),
                options: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 2, maxLength: 4 }),
                correctAnswer: fc.integer({ min: 0, max: 3 }),
                userAnswer: fc.option(fc.integer({ min: 0, max: 3 }), { nil: undefined }),
                bloomLevel: fc.integer({ min: 1, max: 6 })
              }),
              { minLength: 1, maxLength: 5 }
            ),
            score: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
            maxScore: fc.integer({ min: 1, max: 100 }),
            timeTaken: fc.option(fc.integer({ min: 1, max: 3600 }), { nil: undefined }),
            difficultyLevel: fc.integer({ min: 1, max: 5 }),
            completedAt: fc.option(fc.date(), { nil: undefined }),
            synced: fc.boolean(),
            createdAt: fc.date(),
            belongsToTargetUser: fc.boolean()
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (targetUserId, quizAttemptsData) => {
          const quizAttempts: OfflineQuizAttempt[] = quizAttemptsData.map(data => {
            const { belongsToTargetUser, ...attemptData } = data;
            return {
              ...attemptData,
              userId: belongsToTargetUser ? targetUserId : data.userId,
              questions: data.questions.map(q => ({
                ...q,
                correctAnswer: Math.min(q.correctAnswer, q.options.length - 1),
                userAnswer: q.userAnswer !== undefined ? Math.min(q.userAnswer, q.options.length - 1) : undefined
              }))
            };
          });

          for (const attempt of quizAttempts) {
            await offlineStorage.saveQuizAttempt(attempt);
          }

          const userAttempts = await offlineStorage.getQuizAttemptsByUser(targetUserId);
          const expectedCount = quizAttempts.filter(a => a.userId === targetUserId).length;
          expect(userAttempts.length).toBe(expectedCount);
          
          for (const attempt of userAttempts) {
            expect(attempt.userId).toBe(targetUserId);
          }
        }
      ),
      { numRuns: 30 }
    );
  });
});

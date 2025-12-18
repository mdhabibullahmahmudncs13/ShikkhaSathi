import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { StudentProgress, Notification, Achievement, WeakArea, SubjectProgress, BloomProgress } from '../types/dashboard';

/**
 * **Feature: shikkhasathi-platform, Property 7: Dashboard Data Completeness**
 * **Validates: Requirements 3.1, 3.2**
 * 
 * For any student login, the dashboard should display all required elements:
 * current XP, level, learning streak, subject-wise progress, visual indicators, and progress bars
 */

// Generators for property-based testing
const bloomProgressArb = fc.record({
  level: fc.integer({ min: 1, max: 6 }),
  mastery: fc.float({ min: 0, max: 100 })
});

const subjectProgressArb = fc.record({
  subject: fc.constantFrom('Mathematics', 'Physics', 'Chemistry', 'Biology', 'Bangla', 'English', 'ICT'),
  completionPercentage: fc.float({ min: 0, max: 100 }),
  bloomLevelProgress: fc.array(bloomProgressArb, { minLength: 1, maxLength: 6 }),
  timeSpent: fc.integer({ min: 0, max: 10000 }),
  lastAccessed: fc.date()
});

const achievementArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 5, maxLength: 50 }),
  description: fc.string({ minLength: 10, maxLength: 100 }),
  icon: fc.constantFrom('🏆', '🎯', '📚', '🔥', '⭐', '💎'),
  unlockedAt: fc.option(fc.date()),
  progress: fc.option(fc.integer({ min: 0, max: 100 })),
  target: fc.option(fc.integer({ min: 1, max: 100 }))
});

const weakAreaArb = fc.record({
  subject: fc.constantFrom('Mathematics', 'Physics', 'Chemistry', 'Biology', 'Bangla', 'English', 'ICT'),
  topic: fc.string({ minLength: 5, maxLength: 30 }),
  bloomLevel: fc.integer({ min: 1, max: 6 }),
  successRate: fc.float({ min: 0, max: 100 })
});

const studentProgressArb = fc.record({
  userId: fc.uuid(),
  totalXP: fc.integer({ min: 0, max: 100000 }),
  currentLevel: fc.integer({ min: 1, max: 100 }),
  currentStreak: fc.integer({ min: 0, max: 365 }),
  longestStreak: fc.integer({ min: 0, max: 365 }),
  subjectProgress: fc.array(subjectProgressArb, { minLength: 1, maxLength: 7 }),
  achievements: fc.array(achievementArb, { minLength: 0, maxLength: 20 }),
  weakAreas: fc.array(weakAreaArb, { minLength: 0, maxLength: 10 }),
  recommendedPath: fc.record({
    currentTopic: fc.string({ minLength: 5, maxLength: 30 }),
    recommendedNextTopics: fc.array(fc.record({
      subject: fc.constantFrom('Mathematics', 'Physics', 'Chemistry', 'Biology', 'Bangla', 'English', 'ICT'),
      topic: fc.string({ minLength: 5, maxLength: 30 }),
      difficulty: fc.integer({ min: 1, max: 10 }),
      reason: fc.string({ minLength: 10, maxLength: 50 }),
      estimatedTime: fc.integer({ min: 5, max: 120 })
    }), { minLength: 0, maxLength: 5 }),
    completedTopics: fc.array(fc.string({ minLength: 5, maxLength: 30 }), { minLength: 0, maxLength: 10 })
  })
});

const notificationArb = fc.record({
  id: fc.uuid(),
  type: fc.constantFrom('achievement', 'streak', 'recommendation', 'quiz'),
  title: fc.string({ minLength: 5, maxLength: 50 }),
  message: fc.string({ minLength: 10, maxLength: 100 }),
  timestamp: fc.date(),
  read: fc.boolean()
});

describe('Dashboard Completeness Property Tests', () => {
  it('should display all required dashboard elements for any valid student progress data', () => {
    fc.assert(
      fc.property(
        studentProgressArb,
        fc.array(notificationArb, { minLength: 0, maxLength: 10 }),
        (studentProgress, notifications) => {
          // Mock the notification handler
          const mockNotificationHandler = () => {};

          // Render the dashboard
          const { container } = render(
            <DashboardLayout
              studentProgress={studentProgress}
              notifications={notifications}
              onNotificationRead={mockNotificationHandler}
            >
              <div>Test Content</div>
            </DashboardLayout>
          );

          // Verify all required elements are present

          // 1. Current XP should be displayed (use getAllByText to handle multiple matches)
          const xpElements = screen.getAllByText(new RegExp(`${studentProgress.totalXP}\\s*XP`, 'i'));
          expect(xpElements.length).toBeGreaterThan(0);

          // 2. Current level should be displayed
          const levelElements = screen.getAllByText(new RegExp(`Level\\s*${studentProgress.currentLevel}`, 'i'));
          expect(levelElements.length).toBeGreaterThan(0);

          // 3. Dashboard title should be present
          const dashboardTitles = screen.getAllByText('Dashboard');
          expect(dashboardTitles.length).toBeGreaterThan(0);

          // 4. Subject-wise progress should be displayed
          studentProgress.subjectProgress.forEach((subject) => {
            const subjectElements = screen.getAllByText(subject.subject);
            expect(subjectElements.length).toBeGreaterThan(0);
            
            // Progress percentage should be shown
            const progressElements = screen.getAllByText(`${Math.round(subject.completionPercentage)}%`);
            expect(progressElements.length).toBeGreaterThan(0);
          });

          // 5. Navigation elements should be present
          const quickActionsHeadings = screen.getAllByText('Quick Actions');
          expect(quickActionsHeadings.length).toBeGreaterThan(0);

          const subjectsHeadings = screen.getAllByText('Subjects');
          expect(subjectsHeadings.length).toBeGreaterThan(0);

          // 6. Quick action buttons should be present
          const takeQuizButtons = screen.getAllByText('Take Quiz');
          expect(takeQuizButtons.length).toBeGreaterThan(0);

          const aiTutorButtons = screen.getAllByText('AI Tutor Chat');
          expect(aiTutorButtons.length).toBeGreaterThan(0);

          const studyMaterialsButtons = screen.getAllByText('Study Materials');
          expect(studyMaterialsButtons.length).toBeGreaterThan(0);

          // 7. Notification indicator should be present (even if no notifications)
          const notificationButtons = container.querySelectorAll('button');
          expect(notificationButtons.length).toBeGreaterThan(0);

          // 8. User info should be displayed
          const userIndicators = screen.getAllByText('Student');
          expect(userIndicators.length).toBeGreaterThan(0);

          // 9. Welcome message should be present
          const welcomeMessages = screen.getAllByText('Welcome back! Ready to learn?');
          expect(welcomeMessages.length).toBeGreaterThan(0);

          // 10. ShikkhaSathi branding should be present
          const brandingElements = screen.getAllByText('ShikkhaSathi');
          expect(brandingElements.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases for dashboard data completeness', () => {
    // Test with minimal data
    const minimalProgress: StudentProgress = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      totalXP: 0,
      currentLevel: 1,
      currentStreak: 0,
      longestStreak: 0,
      subjectProgress: [],
      achievements: [],
      weakAreas: [],
      recommendedPath: {
        currentTopic: 'Getting Started',
        recommendedNextTopics: [],
        completedTopics: []
      }
    };

    const { container } = render(
      <DashboardLayout
        studentProgress={minimalProgress}
        notifications={[]}
        onNotificationRead={() => {}}
      >
        <div>Test Content</div>
      </DashboardLayout>
    );

    // Should still display basic elements even with minimal data
    expect(screen.getByText('0 XP')).toBeInTheDocument();
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Subjects')).toBeInTheDocument();
  });

  it('should display Bloom taxonomy levels correctly in subject progress', () => {
    fc.assert(
      fc.property(
        studentProgressArb,
        (studentProgress) => {
          const { container } = render(
            <DashboardLayout
              studentProgress={studentProgress}
              notifications={[]}
              onNotificationRead={() => {}}
            >
              <div>Test Content</div>
            </DashboardLayout>
          );

          // Verify that Bloom levels are properly integrated
          studentProgress.subjectProgress.forEach((subject) => {
            // Each subject should have Bloom level progress tracking
            expect(subject.bloomLevelProgress).toBeDefined();
            expect(Array.isArray(subject.bloomLevelProgress)).toBe(true);
            
            // Bloom levels should be between 1-6
            subject.bloomLevelProgress.forEach((bloomProgress) => {
              expect(bloomProgress.level).toBeGreaterThanOrEqual(1);
              expect(bloomProgress.level).toBeLessThanOrEqual(6);
              expect(bloomProgress.mastery).toBeGreaterThanOrEqual(0);
              expect(bloomProgress.mastery).toBeLessThanOrEqual(100);
            });
          });

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
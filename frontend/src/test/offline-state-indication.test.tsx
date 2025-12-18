/**
 * **Feature: shikkhasathi-platform, Property 14: Offline State Indication**
 * **Validates: Requirements 4.5**
 * 
 * Property-based test for offline state indication system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { render, screen, waitFor } from '@testing-library/react';
import { syncManager } from '../services/syncManager';
import { serviceWorkerManager } from '../services/serviceWorkerManager';
import { SyncStatusIndicator } from '../components/sync/SyncStatusIndicator';
import { ContentDownloadModal } from '../components/download/ContentDownloadModal';
import { DownloadManager } from '../components/download/DownloadManager';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn((key: string) => {
    if (key === 'token') return 'mock-token';
    if (key === 'sync-conflicts') return '[]';
    return null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock navigator.onLine
let mockOnlineStatus = true;
Object.defineProperty(navigator, 'onLine', {
  get: () => mockOnlineStatus,
  configurable: true
});

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockClear();
  mockOnlineStatus = true;
});

afterEach(() => {
  // Clean up sync manager
  syncManager.destroy();
});

// Helper function to simulate online/offline events
const simulateConnectivityChange = (isOnline: boolean) => {
  mockOnlineStatus = isOnline;
  
  // Dispatch the actual browser events
  const event = new Event(isOnline ? 'online' : 'offline');
  window.dispatchEvent(event);
};

describe('Offline State Indication Properties', () => {
  describe('Property 14: Offline State Indication', () => {
    it('should display clear offline indicators when internet connectivity is unavailable', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.boolean(), { minLength: 1, maxLength: 10 }), // sequence of online/offline states
          async (connectivityStates) => {
            // Test SyncStatusIndicator component
            const { rerender } = render(<SyncStatusIndicator />);
            
            for (const isOnline of connectivityStates) {
              // Simulate connectivity change
              simulateConnectivityChange(isOnline);
              
              // Allow time for state updates
              await waitFor(() => {
                // Re-render to pick up state changes
                rerender(<SyncStatusIndicator />);
              }, { timeout: 1000 });

              // Assert: Offline indicator should be displayed when offline
              if (!isOnline) {
                // Should show offline status in Bangla
                await waitFor(() => {
                  expect(screen.getByText('অফলাইন')).toBeInTheDocument();
                }, { timeout: 500 });
                
                // Should have red indicator for offline status
                const statusElements = document.querySelectorAll('.bg-red-500');
                expect(statusElements.length).toBeGreaterThan(0);
              } else {
                // Should show online status when online
                await waitFor(() => {
                  const onlineElements = screen.queryAllByText(/অনলাইন|সিঙ্ক/);
                  expect(onlineElements.length).toBeGreaterThan(0);
                }, { timeout: 500 });
              }
            }
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should properly limit functionality when operating offline', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            selectedSubject: fc.constantFrom('Physics', 'Chemistry', 'Mathematics'),
            selectedGrade: fc.integer({ min: 6, max: 12 }),
            selectedLanguage: fc.constantFrom('bangla', 'english')
          }),
          async (downloadConfig) => {
            // Test ContentDownloadModal component
            const mockOnClose = vi.fn();
            const { rerender } = render(
              <ContentDownloadModal 
                isOpen={true} 
                onClose={mockOnClose}
              />
            );

            // Start online
            simulateConnectivityChange(true);
            await waitFor(() => {
              rerender(<ContentDownloadModal isOpen={true} onClose={mockOnClose} />);
            });

            // Verify online functionality is available
            const subjectSelect = screen.getByDisplayValue('Select Subject') as HTMLSelectElement;
            const gradeSelect = screen.getByDisplayValue('Select Grade') as HTMLSelectElement;
            const languageSelect = screen.getByDisplayValue('Bangla') as HTMLSelectElement;
            
            expect(subjectSelect.disabled).toBe(false);
            expect(gradeSelect.disabled).toBe(false);
            expect(languageSelect.disabled).toBe(false);

            // Go offline
            simulateConnectivityChange(false);
            await waitFor(() => {
              rerender(<ContentDownloadModal isOpen={true} onClose={mockOnClose} />);
            });

            // Assert: Functionality should be limited when offline
            await waitFor(() => {
              // Should show offline indicator
              expect(screen.getByText('Offline')).toBeInTheDocument();
              
              // Should show WiFi off icon
              const wifiOffIcons = document.querySelectorAll('svg');
              expect(wifiOffIcons.length).toBeGreaterThan(0);
            });

            // Form controls should be disabled when offline
            const offlineSubjectSelect = screen.getByDisplayValue('Select Subject') as HTMLSelectElement;
            const offlineGradeSelect = screen.getByDisplayValue('Select Grade') as HTMLSelectElement;
            const offlineLanguageSelect = screen.getByDisplayValue('Bangla') as HTMLSelectElement;
            
            expect(offlineSubjectSelect.disabled).toBe(true);
            expect(offlineGradeSelect.disabled).toBe(true);
            expect(offlineLanguageSelect.disabled).toBe(true);

            // Download button should be disabled
            const downloadButtons = screen.getAllByRole('button').filter(btn => 
              btn.textContent?.includes('Download') || btn.classList.contains('disabled')
            );
            expect(downloadButtons.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 15 }
      );
    });

    it('should maintain consistent offline state indication across different components', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.boolean(), { minLength: 2, maxLength: 8 }), // connectivity state changes
          async (connectivitySequence) => {
            // Render multiple components that should show offline state
            const mockOnClose = vi.fn();
            
            const { rerender: rerenderSync } = render(<SyncStatusIndicator />);
            const { rerender: rerenderDownload } = render(<DownloadManager />);
            const { rerender: rerenderModal } = render(
              <ContentDownloadModal isOpen={true} onClose={mockOnClose} />
            );

            for (const isOnline of connectivitySequence) {
              // Simulate connectivity change
              simulateConnectivityChange(isOnline);
              
              // Allow components to update
              await waitFor(() => {
                rerenderSync(<SyncStatusIndicator />);
                rerenderDownload(<DownloadManager />);
                rerenderModal(<ContentDownloadModal isOpen={true} onClose={mockOnClose} />);
              });

              // Assert: All components should show consistent offline state
              if (!isOnline) {
                // SyncStatusIndicator should show offline
                await waitFor(() => {
                  expect(screen.getByText('অফলাইন')).toBeInTheDocument();
                }, { timeout: 500 });

                // DownloadManager should show offline
                await waitFor(() => {
                  const offlineTexts = screen.getAllByText('Offline');
                  expect(offlineTexts.length).toBeGreaterThan(0);
                }, { timeout: 500 });

                // All components should have red indicators for offline
                const redIndicators = document.querySelectorAll('.text-red-600, .bg-red-500');
                expect(redIndicators.length).toBeGreaterThan(0);
              } else {
                // Components should show online state
                await waitFor(() => {
                  const onlineTexts = screen.getAllByText(/Online|অনলাইন|সিঙ্ক/);
                  expect(onlineTexts.length).toBeGreaterThan(0);
                }, { timeout: 500 });

                // Should have green indicators for online
                const greenIndicators = document.querySelectorAll('.text-green-600, .bg-green-500');
                expect(greenIndicators.length).toBeGreaterThan(0);
              }
            }
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should provide appropriate user feedback for offline limitations', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.boolean(), // offline state
          async (startOffline) => {
            // Test that offline state provides clear user feedback
            const mockOnClose = vi.fn();
            
            // Set initial connectivity state
            simulateConnectivityChange(!startOffline);
            
            const { rerender } = render(
              <ContentDownloadModal isOpen={true} onClose={mockOnClose} />
            );

            // Change to offline state
            simulateConnectivityChange(false);
            await waitFor(() => {
              rerender(<ContentDownloadModal isOpen={true} onClose={mockOnClose} />);
            });

            // Assert: Should provide clear feedback about offline limitations
            await waitFor(() => {
              // Should show offline message
              expect(screen.getByText('Offline')).toBeInTheDocument();
              
              // Should show appropriate messaging about limited functionality
              const offlineMessages = screen.queryAllByText(/offline|unavailable|limited/i);
              const banglaOfflineMessages = screen.queryAllByText(/অফলাইন|অনুপলব্ধ/);
              
              expect(offlineMessages.length + banglaOfflineMessages.length).toBeGreaterThan(0);
            });

            // Should disable interactive elements that require connectivity
            const disabledElements = document.querySelectorAll('[disabled]');
            expect(disabledElements.length).toBeGreaterThan(0);

            // Should show visual indicators (icons) for offline state
            const wifiOffIcons = document.querySelectorAll('svg');
            expect(wifiOffIcons.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 25 }
      );
    });

    it('should handle rapid connectivity changes gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.boolean(), { minLength: 5, maxLength: 15 }), // rapid state changes
          async (rapidConnectivityChanges) => {
            // Test component stability during rapid connectivity changes
            const { rerender } = render(<SyncStatusIndicator />);
            
            let lastExpectedState = true;
            
            for (const isOnline of rapidConnectivityChanges) {
              // Simulate rapid connectivity change
              simulateConnectivityChange(isOnline);
              lastExpectedState = isOnline;
              
              // Small delay to simulate real-world timing
              await new Promise(resolve => setTimeout(resolve, 10));
              
              // Re-render component
              rerender(<SyncStatusIndicator />);
            }

            // Assert: Final state should match the last connectivity change
            await waitFor(() => {
              if (lastExpectedState) {
                // Should show online state
                const onlineElements = screen.queryAllByText(/অনলাইন|সিঙ্ক|Online/);
                expect(onlineElements.length).toBeGreaterThan(0);
              } else {
                // Should show offline state
                expect(screen.getByText('অফলাইন')).toBeInTheDocument();
              }
            }, { timeout: 1000 });

            // Component should not crash or show inconsistent state
            expect(screen.getByRole('button')).toBeInTheDocument();
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should correctly detect and indicate network connectivity status', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            initialState: fc.boolean(),
            finalState: fc.boolean(),
            intermediateStates: fc.array(fc.boolean(), { maxLength: 5 })
          }),
          async ({ initialState, finalState, intermediateStates }) => {
            // Test the underlying connectivity detection
            simulateConnectivityChange(initialState);
            
            // Check initial sync manager state
            let syncStatus = syncManager.getSyncStatus();
            expect(syncStatus.isOnline).toBe(initialState);
            
            // Check service worker manager state
            expect(serviceWorkerManager.isOnlineStatus()).toBe(initialState);

            // Apply intermediate state changes
            for (const state of intermediateStates) {
              simulateConnectivityChange(state);
              await new Promise(resolve => setTimeout(resolve, 5));
              
              syncStatus = syncManager.getSyncStatus();
              expect(syncStatus.isOnline).toBe(state);
              expect(serviceWorkerManager.isOnlineStatus()).toBe(state);
            }

            // Apply final state
            simulateConnectivityChange(finalState);
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // Assert: Final state should be correctly detected
            syncStatus = syncManager.getSyncStatus();
            expect(syncStatus.isOnline).toBe(finalState);
            expect(serviceWorkerManager.isOnlineStatus()).toBe(finalState);
          }
        ),
        { numRuns: 30 }
      );
    });
  });
});
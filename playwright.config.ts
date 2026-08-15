import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 120 * 1000,

  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    actionTimeout: 15 * 1000,
    navigationTimeout: 60 * 1000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000
  }
});

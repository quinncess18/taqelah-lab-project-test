import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  
  // Visual testing specific settings
  expect: {
    toHaveScreenshot: {
      // Maximum allowed pixel difference
      maxDiffPixels: 100,
      // Or use percentage threshold
      maxDiffPixelRatio: 0.01,
      // Animation handling
      animations: 'disabled',
      // Caret hiding
      caret: 'hide',
    },
    toMatchSnapshot: {
      // Threshold for image comparison
      threshold: 0.2,
    },
  },
  
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
   // Ensure consistent test ordering for deterministic sharding
  testMatch: '**/*.spec.ts',
  reporter: [
    ['list'],
    ['blob'],
    ['html', {
      open: 'on-failure',  // 'always' | 'never' | 'on-failure'
    }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://taqelah.sg',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 1000, // Adds 1 second delay between actions
      headless: false,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

//    {
//      name: 'firefox',
//      use: { ...devices['Desktop Firefox'] },
//    },

//    {
//      name: 'webkit',
//      use: { ...devices['Desktop Safari'] },
//    },

    /* Test against mobile viewports. */
   {
     name: 'Mobile Chrome',
     use: { ...devices['Pixel 5'] },
   },
     {
       name: 'Mobile Safari',
       use: { ...devices['iPhone 12'] },
     },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },

    // Add these to the projects array
    {
      name: 'staging',
      use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://taqelah.sg',
      },
    },
    {
      name: 'production',
      use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://taqelah.sg',
      },
    },

     // Smoke tests - run on all browsers
    {
      name: 'smoke-chromium',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke-firefox',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'smoke-webkit',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    // Setup tests - run once before all other tests
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Regression tests - Chromium only
    {
      name: 'regression',
      testDir: './tests/regression',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // Mobile tests - Android and iOS
    {
      name: 'Mobile Chrome',
      testDir: './tests/mobile',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      testDir: './tests/mobile',
      use: { ...devices['iPhone 13'] },
      dependencies: ['setup'],
    },

     // Visual testing - consistent environment required
    {
      name: 'visual-tests',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        // Fixed viewport for consistent screenshots
        viewport: { width: 1280, height: 720 },
        // Disable animations for stable screenshots
        launchOptions: {
          args: ['--disable-animations'],
        },
      },
      // Run visual tests serially for consistency
      fullyParallel: false,
    },

    // Visual testing on different viewports
    {
      name: 'visual-mobile',
      testDir: './tests/visual',
      use: {
        ...devices['iPhone 13'],
      },
      fullyParallel: false,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
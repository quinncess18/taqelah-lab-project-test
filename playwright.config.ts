import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 20000, // 20 seconds per test
  
  // Visual testing specific settings
  expect: {
    toHaveScreenshot: {
      // Maximum allowed pixel difference
      maxDiffPixels: 100,
      // Or use percentage threshold
      maxDiffPixelRatio: 0.05, // 5% difference allowed
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
  workers: process.env.CI ? 1 : 4,
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
      // slowMo: 1000, // Adds 1 second delay between actions
      headless: false,
    },
  },
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}',

  // Test against different environments.
  projects: [

    // Functional tests - run on all desktop browsers, excluding visual tests
    {
      name: 'main-desktop-chrome',
      testIgnore: '**/*.visual.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        },
    },
    {
      name: 'main-desktop-firefox',
      timeout: 60000, // Reduced from 120s to 60s (1 minute is enough for 186 tests)
      testIgnore: '**/*.visual.spec.ts', 
      use: {
        ...devices['Desktop Firefox'],
        // No need for custom expect timeouts here; keep it global
      },
    },
    {
      name: 'main-desktop-safari',
      testIgnore: '**/*.visual.spec.ts', // Exclude visual tests from this project
      use: {
        ...devices['Desktop Safari'],
        },
    },

    // Mobile browsers - run on mobile devices, excluding visual tests
    {
      name: 'mobile-safari',
      testDir: './tests/mobile', // Specify a separate directory for mobile tests
      use: {
        ...devices['iPhone 13'],
      },
      fullyParallel: false,
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      testDir: './tests/mobile', // Specify a separate directory for mobile tests
      use: {
        ...devices['Pixel 5'],
      },
      fullyParallel: false,
      dependencies: ['setup'],
    },

    // Setup tests - run once before all other tests
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

     // Smoke tests - run on all browsers
    {
      name: 'smoke-chromium',
      testMatch: /.*\.smoke\.spec\.ts/,
      testIgnore: '**/*.visual.spec.ts', // Exclude visual tests from smoke tests
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke-firefox',
      testMatch: /.*\.smoke\.spec\.ts/,
      testIgnore: '**/*.visual.spec.ts', // Exclude visual tests from smoke tests
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'smoke-webkit',
      testMatch: /.*\.smoke\.spec\.ts/,
      testIgnore: '**/*.visual.spec.ts', // Exclude visual tests from smoke tests
      use: { ...devices['Desktop Safari'] },
    },

    // Desktop browsers with specific base URLs for staging and production environments
    {
      name: 'staging',
      testIgnore: '**/*.visual.spec.ts', // Exclude visual tests from this project
      use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://taqelah.sg',
      },
    },
    {
      name: 'production',
      testMatch: /.*\.smoke\.spec\.ts/,
      testIgnore: '**/*.visual.spec.ts', // Exclude visual tests from this project
      use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://taqelah.sg',
      },
    },

    // Regression tests - Chromium only
    {
      name: 'regression',
      testIgnore: '**/*.visual.spec.ts', // Exclude visual tests from this project
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // Visual testing - run on a single browser with specific settings for stable screenshots
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

    /* --- CHALLENGE 4: RESPONSIVE PROJECTS --- */

    {
      name: 'visual-tablet',
      testDir: './tests/visual',
      use: { 
        ...devices['iPad Mini'],
      },
    },

    {
      name: 'visual-wide',
      testDir: './tests/visual',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
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
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
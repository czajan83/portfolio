import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
    timeout: 18000000,
    retries: 0,
    testDir: 'tests',
    use: {
        headless: true,
    },

    projects: [
    {
        name: "Chrome",
        use: { browserName: "chromium" }
    }
    ]
};

export default config;
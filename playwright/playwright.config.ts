import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
    timeout: 180000,
    retries: 0,
    testDir: 'tests',
    use: {
        headless: true,
    },

    projects: [
    {
        name: "Chrome",
        use: { browserName: "chromium" }
    },
    {
        name: "Firefox",
        use: { browserName: "firefox" }
    },    
    {
        name: "Webkit",
        use: { browserName: "webkit" }
    },
    ]
};

export default config;
import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
    timeout: 45000,
    retries: 0,
    testDir: 'tests',
    use: {
        headless: false,
        screenshot: "only-on-failure",
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
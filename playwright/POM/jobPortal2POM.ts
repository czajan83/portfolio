declare var require: any
import { expect, Locator, Page } from "@playwright/test";

export class JobPortal2 {
    readonly page: Page;
    readonly jobItem: Locator;
    readonly website: string;

    constructor(page: Page) {
        this.page = page;
        this.jobItem = page.locator('');
        this.website = JSON.parse(JSON.stringify(require("../hidden_data.json"))).job_portal_2;
    }

    async closeCookiesPopup() {
        const cookiesPopupPath = '.cookies_aropjbf > div > button.size-medium.variant-primary.core_b1fqykql';
        if(await this.page.locator(cookiesPopupPath).isVisible())
            await this.page.locator(cookiesPopupPath).click();
    }
}
declare var require: any
import { expect, Locator, Page } from "@playwright/test";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export class BuildingPlotsPortal2 {
    readonly page: Page;
    readonly buildingPlotItem: Locator;
    readonly website: string;

    constructor(page: Page) {
        this.page = page;
        this.buildingPlotItem = page.locator('');
        this.website = JSON.parse(JSON.stringify(require("../hidden_data.json"))).buildingPlotsPortal2;
    }

    async closeCookiesPopup(): Promise<void> {
        const cookiesPopupPath = '#onetrust-accept-btn-handler';
        if(await this.page.locator(cookiesPopupPath).isVisible()) await this.page.locator(cookiesPopupPath).click();
        await delay(5000)
    }
}
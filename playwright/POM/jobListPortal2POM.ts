declare var require: any
import { expect, Locator, Page } from "@playwright/test";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export class JobsList {
    readonly page: Page;
    readonly jobItem: Locator;
    readonly multiLocationHeader: string;
    readonly website: string;

    constructor(page: Page) {
        this.page = page;
        this.jobItem = page.locator('');
        this.multiLocationHeader = ' > h4';
        this.website = JSON.parse(JSON.stringify(require("../hidden_data.json"))).job_portal_2;
    }

    async openPage() {
        const cookiesPopupPath = '.cookies_aropjbf > div > button.size-medium.variant-primary.core_b1fqykql';
        const fairPopupPath = '.popup_p1c6glb0';
        await this.page.goto( this.website + '/praca/tester%20oprogramowania;kw' );
        await delay(2000);
        if(await this.page.locator(cookiesPopupPath).isVisible())
            await this.page.locator(cookiesPopupPath).click();
        if(await this.page.locator(fairPopupPath).isVisible())
            await this.page.locator(fairPopupPath).click();
    }

    async getJobsListLength():Promise<string> {
        return await this.page.locator('#search > div > div > div > div.listing_s1e6x2e0 > div.listing_m1em0ops > button > span.core_c11srdo1.variant-primary').innerText()
    }

    async getJobItemPath(item: string) {
        return await '#offers-list > div:nth-child(3) > div:nth-child(' + item + ') > ';
    }

    async getJobItemDetailsPath(item: string) {
        return await this.getJobItemPath(item) + 'div > div > div.tiles_cjkyq1p > div.tiles_cghoimp > ';
    }

    async getJobItemHeaderPath(item: string) {
        return await this.getJobItemDetailsPath(item) + 'h2';
    }

    async getJobItemLinkPath(item: string) {
        return await this.getJobItemHeaderPath(item) + '> a';
    }

    async getJobItemEmployerLinkPath(item: string) {
        return await this.getJobItemDetailsPath(item) + 'div.tiles_c2ezmf3 > div.tiles_c3ppts3 > div.tiles_c639tii > ';
    }

    async checkIfJobItemExists(item: string) {
        if(await this.page.locator('#offers-list > div:nth-child(3) > div:nth-child(' + item + ')').isVisible())
            return true;
        return false;
    }

    async getJobItemTitle(item: string) {
        if(await this.page.locator(await this.getJobItemLinkPath(item)).isVisible())
            return await this.page.locator(await this.getJobItemLinkPath(item)).innerText();
        const jobItemMultiLocationDivPath = await this.getJobItemDetailsPath(item) + 'div.tiles_c2ezmf3 > div.tiles_c3ppts3';
        const jobItemMultiLocationHeaderPath = jobItemMultiLocationDivPath + this.multiLocationHeader;
        if(await this.page.locator(jobItemMultiLocationHeaderPath).isVisible())
            await this.page.locator(jobItemMultiLocationHeaderPath).click()
        else
            await this.page.locator(jobItemMultiLocationDivPath + ' > div.tiles_r11dm8ju' + this.multiLocationHeader).click()
        return await this.page.locator(await this.getJobItemHeaderPath(item)).innerText();
    }

    async getJobItemLink(item: string) {
        if(await this.page.locator(await this.getJobItemLinkPath(item)).isVisible())
            return await this.page.locator(await this.getJobItemLinkPath(item)).getAttribute('href');
        return await this.page.locator(await this.getJobItemDetailsPath(item) + 'div.tiles_b9134ym > div > div:nth-child(1) > a' ).getAttribute('href');
    }

    async getJobItemSalary(item: string) {
        const jobItemSalaryPath = await this.getJobItemDetailsPath(item) + 'span:nth-child(5)';
        if(await this.page.locator(jobItemSalaryPath).isVisible())
            return await this.page.locator(jobItemSalaryPath).innerText();
        return ''
    }

    async getJobItemEmployer(item: string) {
        if(await this.page.locator(await this.getJobItemEmployerLinkPath(item) + 'a:nth-child(2)').isVisible())
            return await this.page.locator(await this.getJobItemEmployerLinkPath(item) + 'a:nth-child(1) > h3').innerText();
        return await this.page.locator(await this.getJobItemEmployerLinkPath(item) + 'a > h3').innerText();
    }

    async getJobItemEmployerLink(item: string) {        
        if(await this.page.locator(await this.getJobItemEmployerLinkPath(item) + 'a:nth-child(2)').isVisible())
            return await this.page.locator(await this.getJobItemEmployerLinkPath(item) + 'a:nth-child(1)').getAttribute('href');
        return await this.page.locator(await this.getJobItemEmployerLinkPath(item)+ 'a').getAttribute('href');
    }

    async getJobItemSeniorityLevel(item: string) {
        return await this.page.locator(await this.getJobItemDetailsPath(item) + 'ul > li:nth-child(1)' ).innerText();
    }

    async getJobItemRemoteOption(item: string) {
        var index = 10;
        while(index>3) {
            let jobItemRemoteAvailabilityPath = await this.getJobItemDetailsPath(item) + 'ul > li:nth-child(' + index.toString() + ')'
            if(await this.page.locator(jobItemRemoteAvailabilityPath).isVisible())
                return await this.page.locator(jobItemRemoteAvailabilityPath).innerText();
            index--;
        }
        return ''
    }

    async switchToNextCard() {
        const switchToNextCardPath = '#offers-list > div.listing_b1x0kate.core_po9665q > div.listing_p1k3sq6e > div > button.listing_ngj95i6.listing_s1hxgdve.size-small.variant-ghost.core_b1fqykql';
        if(await this.page.locator(switchToNextCardPath).isVisible()) {
            await this.page.locator(switchToNextCardPath).click();
            await delay(2000);
        }
    }
}
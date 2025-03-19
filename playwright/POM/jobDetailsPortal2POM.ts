declare var require: any
import { expect, Locator, Page } from "@playwright/test";
import { JobPortal2 } from "./jobPortal2POM";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export class JobDetailsPortal2 extends JobPortal2 {
    basePath: string
    baseIndex: string
    reqIndex: string

    constructor(page: Page) {
        super(page);
        this.basePath = '#offer-details > div.o1eg7akv > section:nth-child(';
        this.baseIndex = '';
        this.reqIndex = '';
    }

    async openPage(link: string):Promise<void> {
        await this.page.goto(link);
    }

    async getJobBaseChildPath(baseIndex: string):Promise<string> {
        return await this.basePath + baseIndex + ') > '
    }

    async getJobReqSearchLocator(baseIndex: string):Promise<Locator> {
        return await this.page.locator(await this.getJobBaseChildPath(baseIndex) + 'div.c8zsosj > h2');
    }

    async getJobReqLocator(reqIndex: string, reqItemIndex: string): Promise<Locator> {
        return await this.page.locator(await this.getJobBaseChildPath(this.baseIndex) + 'div.c1s1xseq > div:nth-child(' + reqIndex + ') > div > ul > li:nth-child(' + reqItemIndex + ')');
    }

    async getJobReqsChildNumber(): Promise<void> {
        var searchIndex = 0;
        while(searchIndex < 10) {
            const searchIndexString = searchIndex.toString();
            if(await (await this.getJobReqSearchLocator(searchIndexString)).isVisible()) {
                const caption = await (await this.getJobReqSearchLocator(searchIndexString)).innerText();
                if(caption == "Nasze wymagania" || caption == "Our requirements" || caption == "Wymagania pracodawcy") {
                    this.baseIndex = searchIndexString;
                    searchIndex = 11;
                }
            }
            searchIndex++;
        }
    }

    async getJobReqs(reqIndex: string): Promise<string> {
        var requirements = '';
        var reqItemIndex = 1;
    
        while(reqItemIndex < 50) {
            if(await (await this.getJobReqLocator(reqIndex, reqItemIndex.toString())).isVisible()) {
                requirements += await (await this.getJobReqLocator(reqIndex, reqItemIndex.toString())).innerText() + '\n';
                reqItemIndex++;
            }
            else
                return requirements;
        }                
        return requirements;
    }
}
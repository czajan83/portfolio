declare var require: any
import { expect, Locator, Page } from "@playwright/test";
import { BuildingPlotsPortal2 } from "./buildingPlotsPortal2POM";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export class BuildingPlotsListPortal2 extends BuildingPlotsPortal2 {
    readonly multiLocationHeader: string;
    sectionNumber: string;

    constructor(page: Page) {    
        super(page);
        this.multiLocationHeader = ' > h4';
        this.sectionNumber = '';
    }

    async openPage(subpage: string): Promise<void> {
        await this.page.goto(this.website + subpage);
        await delay(5000);
    }

    async closeInquiry1Popup() {
        const inquiry1Locator = await this.page.locator('#maze-contextual-widget-host').contentFrame().getByRole('button', { name: 'Close Maze Prompt' })
        if(await inquiry1Locator.isVisible()) await inquiry1Locator.click();
    }

    async closeInquiry2Popup() {
        const inquiry2PopupPath = '#laq-close-SAMetsFPrkWa';
        if(await this.page.locator(inquiry2PopupPath).isVisible())
            await this.page.locator(inquiry2PopupPath).click();
    }

    async getBuildingPlotsListLength(): Promise<number> {
        const listLength = await this.page.getByText('1-72 ogłoszeń z').innerText();
        return Number(listLength.substring(16, 20));
    }   
    
    async getAllOffersSectionNumber(): Promise<string> {
        const links = await this.page.locator('#__next > div.css-1bx5ylf.e1xea6843 > main > div > div.css-79elbk.e1xea6841 > div.css-feokcq.e1xea6844 > div.e1fx09lx0.css-yqh7ml > div.css-1i43dhb.e1fx09lx1 > div > span').allInnerTexts();
        let index = 2;
        for(const link of links) {
            if(link == 'Wszystkie ogłoszenia') return index.toString();
            index++;
        }
        return '';
    }

    async getAllBuildingPlotsItemPath(item: string) {
        this.sectionNumber = await this.getAllOffersSectionNumber();
        console.log(this.sectionNumber);
        return `#offers-list > div:nth-child(${this.sectionNumber}) > div:nth-child(${item}) > div.gp-pp-reset.tiles_b18pwp01.core_po9665q`;
    }

    async getBuildingPlotItemPath(item: string): Promise<string> {
        return `#__next > div.css-1bx5ylf.e1xea6843 > main > div > div.css-79elbk.e1xea6841 > div.css-feokcq.e1xea6844 > div.e1fx09lx0.css-yqh7ml > div.css-1i43dhb.e1fx09lx1 > div:nth-child(${this.sectionNumber}) > ul > li:nth-child(${item}) > article`;
    }

    async getBuildingPlotItemTitlePath(item: string): Promise<string> {
        return await this.getBuildingPlotItemPath(item) + ` > section > div.css-13gthep.eg92do42 > a > p`;
    }

    async getBuildingPlotItemLinkPath(item: string): Promise<string> {
        return await this.getBuildingPlotItemPath(item) + ` > section > div.css-13gthep.eg92do42 > a`;
    }

    async getBuildingPlotItemPricePath(item: string): Promise<string> {
        return await this.getBuildingPlotItemPath(item) + ` > section > div.css-13gthep.eg92do42 > div.css-fdwt8z.eg92do43 > div.css-afwkhs.eg92do47 > span`;
    }

    async getBuildingPlotItemPlacePath(item: string): Promise<string> {
        return await this.getBuildingPlotItemPath(item) + ` > section > div.css-13gthep.eg92do42 > div.css-12h460e.eg92do44 > p`;
    }

    async getBuildingPlotItemAreaPath(item: string): Promise<string> {
        return await this.getBuildingPlotItemPath(item) + ` > section > div.css-13gthep.eg92do42 > div.css-1c1kq07.e1nke57n0 > dl > dd:nth-child(2) > span`;
    }

    async getBuildingPlotItemUnitPricePath(item: string): Promise<string> {
        return await this.getBuildingPlotItemPath(item) + ` > section > div.css-13gthep.eg92do42 > div.css-1c1kq07.e1nke57n0 > dl > dd:nth-child(4) > span`;
    }

    async getBuildingPlotItemReBidPath(item: string): Promise<string> {
        return await this.getBuildingPlotItemPath(item) + ` > section > div.css-13gthep.eg92do42 > div.css-120nera.es3mydq0 > div.css-gduqhf.es3mydq5 > div > div > button`;
    }

    async getBuildingPlotItemLocator(item: string): Promise<Locator> {
        return await this.page.locator(await this.getBuildingPlotItemPath(item));
    }

    async getBuildingPlotItemTitleLocator(item: string): Promise<Locator> {
        return await this.page.locator(await this.getBuildingPlotItemTitlePath(item));
    }

    async getBuildingPlotItemLinkLocator(item: string): Promise<Locator> {
        return await this.page.locator(await this.getBuildingPlotItemLinkPath(item));
    }

    async getBuildingPlotItemPriceLocator(item: string): Promise<Locator> {
        return await this.page.locator(await this.getBuildingPlotItemPricePath(item));
    }

    async getBuildingPlotItemPlaceLocator(item: string): Promise<Locator> {
        return await this.page.locator(await this.getBuildingPlotItemPlacePath(item));
    }

    async getBuildingPlotItemAreaLocator(item: string): Promise<Locator> {
        return await this.page.locator(await this.getBuildingPlotItemAreaPath(item));
    }

    async getBuildingPlotItemUnitPriceLocator(item: string): Promise<Locator> {
        return await this.page.locator(await this.getBuildingPlotItemUnitPricePath(item));
    }

    async getBuildingPlotItemReBidLocator(item: string): Promise<Locator> {
        return await this.page.locator(await this.getBuildingPlotItemReBidPath(item));
    }

    async checkIfBuildingPlotItemExists(item: string) {
        return await (await this.getBuildingPlotItemLocator(item)).isVisible();
    }
    
    async getBuildingPlotItemTitle(item: string) {
        return await (await this.getBuildingPlotItemTitleLocator(item)).innerText();
    }
    
    async getBuildingPlotItemLink(item: string) {
        return await (await this.getBuildingPlotItemLinkLocator(item)).getAttribute('href');
    }
    
    async getBuildingPlotItemPrice(item: string) {
        return await (await this.getBuildingPlotItemPriceLocator(item)).innerText();
    }
    
    async getBuildingPlotItemPlace(item: string) {
        return await (await this.getBuildingPlotItemPlaceLocator(item)).innerText();
    }
    
    async getBuildingPlotItemArea(item: string) {
        return await (await this.getBuildingPlotItemAreaLocator(item)).innerText();
    }
    
    async getBuildingPlotItemUnitPrice(item: string) {
        return await (await this.getBuildingPlotItemUnitPriceLocator(item)).innerText();
    }
    
    async getBuildingPlotItemReBid(item: string) {
        if (await (await this.getBuildingPlotItemReBidLocator(item)).isVisible())
            return 'true';
        return '';
    }

    async pause() {
        await this.page.pause();
    }

    async switchToNextCard(): Promise<boolean> {
        if(await this.page.getByRole('listitem', { name: 'Go to next Page' }).getByRole('img').isVisible()) {
            await this.page.getByRole('listitem', { name: 'Go to next Page' }).getByRole('img').click();
            await delay(10000);
            return true;
        }
        return false;
    }
}
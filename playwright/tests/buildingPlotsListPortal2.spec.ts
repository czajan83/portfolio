declare var require: any

import { test, expect } from "@playwright/test";
import { BuildingPlotsListPortal2 } from "../POM/buildingPlotsListPortal2POM";
import { promises as fs } from 'fs';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


async function createFolder(folderPath: string): Promise<boolean> {
    try {
        await fs.access(folderPath);
        return false;
    }
    catch (error) {
        await fs.mkdir(folderPath);
        return true;
    }
}

async function make_folders(keyword: string): Promise<string> {
    var dirPortal = "../buildingPlotPortal2/";
    var dirBuildingPlotName = dirPortal + keyword + "/";
    var dirDetails = dirBuildingPlotName + "details/";
    
    createFolder(dirPortal);
    createFolder(dirBuildingPlotName);
    createFolder(dirDetails);

    return dirBuildingPlotName + '/';
}

async function perform_test(buildingPlotsList: BuildingPlotsListPortal2): Promise <string> {
    await buildingPlotsList.closeCookiesPopup();
    await buildingPlotsList.closeInquiry1Popup();
    // await buildingPlotsList.closeInquiry2Popup();
    await buildingPlotsList.getAllBuildingPlotsItemPath('');

    const buildingPlotsListLength = await buildingPlotsList.getBuildingPlotsListLength();
    const buildingPlotsCards = Math.ceil(buildingPlotsListLength / 72);

    var buildingPlotsCardIndex = 0;
    var buildingPlotsMaxIndexAtCard = 72;
    var strBuildingPlotsOffersList = '[\n';

    

    while(buildingPlotsCardIndex < buildingPlotsCards) {
        var buildingPlotIndexAtCard = 1;
        if(buildingPlotsCardIndex + 1 == buildingPlotsCards) buildingPlotsMaxIndexAtCard = buildingPlotsListLength - ((buildingPlotsCards - 1) * 72);
        while(buildingPlotIndexAtCard < buildingPlotsMaxIndexAtCard + 1) {
            let strBuildingPlotIndexAtCard = buildingPlotIndexAtCard.toString();
            if(await buildingPlotsList.checkIfBuildingPlotItemExists(strBuildingPlotIndexAtCard)) {
                console.log(buildingPlotsCardIndex * 72 + buildingPlotIndexAtCard)
                let jsonBuildingPlotOffer = {
                    'index': buildingPlotsCardIndex * 72 + buildingPlotIndexAtCard,
                    'title': await buildingPlotsList.getBuildingPlotItemTitle(strBuildingPlotIndexAtCard),
                    'link': await buildingPlotsList.getBuildingPlotItemLink(strBuildingPlotIndexAtCard),
                    'price': await buildingPlotsList.getBuildingPlotItemPrice(strBuildingPlotIndexAtCard),
                    'place': await buildingPlotsList.getBuildingPlotItemPlace(strBuildingPlotIndexAtCard),
                    'area': await buildingPlotsList.getBuildingPlotItemArea(strBuildingPlotIndexAtCard),
                    'unitPrice': await buildingPlotsList.getBuildingPlotItemUnitPrice(strBuildingPlotIndexAtCard),
                    'reBid': await buildingPlotsList.getBuildingPlotItemReBid(strBuildingPlotIndexAtCard),
                    'type': '',
                    'location': '',
                    'streetSurface': '',
                    'fence': '',
                    'electricity': '',
                    'water': '',
                    'sewers': '',
                    'internet': '',
                    'phone': '',
                    'openArea': '',
                    'forest': '',
                    'mountains': '',
                    'lake': '',
                    'estateAgency': '',
                    'userNote': '',
                    'userNote2': '',
                    'userNote3': '',
                    'userNote4': '',
                    'userNote5': ''
                }
                let strJsonBuildingPlotOffer = JSON.stringify(jsonBuildingPlotOffer, null, 2) + ",\n";
                strBuildingPlotsOffersList += strJsonBuildingPlotOffer;
            }
            buildingPlotIndexAtCard++;
        }
        if (!await buildingPlotsList.switchToNextCard()) buildingPlotsCardIndex = buildingPlotsCards;
        buildingPlotsCardIndex++;
    }

    strBuildingPlotsOffersList = strBuildingPlotsOffersList.slice(0, -2);
    strBuildingPlotsOffersList += "\n]"

    return strBuildingPlotsOffersList;

}

test("Get the list of building plots offers: opolskie", async ({ page }) => {

    const dirBuildingPlotname = await make_folders('opolskie')
    let buildingPlotsList: BuildingPlotsListPortal2;
    buildingPlotsList = new BuildingPlotsListPortal2(page);
    await buildingPlotsList.openPage('/pl/wyniki/sprzedaz/dzialka/opolskie?limit=72&by=DEFAULT&direction=DESC&viewType=listing');
    const strBuildingPlotOffersList = await perform_test(buildingPlotsList);
    await buildingPlotsList.pause();
    const timestamp = Date.now();
    await fs.writeFile(`${dirBuildingPlotname}buildingPlotsList_${timestamp}.json`, strBuildingPlotOffersList, 'utf8');

});
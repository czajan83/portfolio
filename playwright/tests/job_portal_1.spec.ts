import { test, expect } from "@playwright/test";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const website = JSON.parse(JSON.stringify(require("../hidden_data.json"))).job_portal_1

const fs = require("fs");
var dir = "jobportal_1/";
if(!fs.existsSync(dir)) fs.mkdirSync(dir, 0o744);

test("First test", async ({ page }) => {
    await page.goto( website + '/Job/poland-tester-oprogramowania-jobs-SRCH_IL.0,6_IN193_KO7,28.htm' );
    let searchResultsText = await page.locator('.SearchResultsHeader_tooltipWrapper__fnh9I h1').innerText();
    console.log(searchResultsText.replace(/[^0-9]/g, ''));
    let i = 1;
    while(await page.isVisible('.JobsList_buttonWrapper__ticwb div button')) {
        await page.click(".JobsList_buttonWrapper__ticwb div button");
        i++;
        await delay(3000);
    }
    let j = 0;
    while(await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).isVisible()) {
        let opening = {
            employer: "",
            title: "",
            link: await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).getAttribute('href'),
            availability: await page.locator('.JobCard_listingAge__jJsuc').nth(j).innerText()
        }
        let jsonOpening = JSON.stringify(opening, null, 2) + "\n";
        fs.writeFile(dir + "/opening_" + j.toString() + ".json", jsonOpening, 'utf8', (err) => {});
        j++;
    }    
});
 
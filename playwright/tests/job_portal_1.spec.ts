import { test, expect } from "@playwright/test";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const website = JSON.parse(JSON.stringify(require("../hidden_data.json"))).job_portal_1

const fs = require("fs");

test("First test", async ({ page }) => {
    await page.goto( website + '/Job/poland-tester-oprogramowania-jobs-SRCH_IL.0,6_IN193_KO7,28.htm' );
    console.log(await page.locator('.SearchResultsHeader_tooltipWrapper__fnh9I h1').innerText());
    let i = 1;
    while(await page.isVisible('.JobsList_buttonWrapper__ticwb div button')) {
        await page.click(".JobsList_buttonWrapper__ticwb div button");
        i++;
        await delay(3000);
    }
    let j = 0;
    fs.writeFile("openings.json", "", 'utf8', (err) => {});
    while(await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).isVisible()) {
        let opening = {
            employer: "",
            title: "",
            link: await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).getAttribute('href'),
            availability: await page.locator('.JobCard_listingAge__jJsuc').nth(j).innerText()
        }
        let jsonOpening = JSON.stringify(opening, null, 2) + "\n";
        fs.appendFile("openings.json", jsonOpening, 'utf8', (err) => {});
        j++;
    }    
});
 
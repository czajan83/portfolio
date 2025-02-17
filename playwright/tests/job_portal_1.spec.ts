import { test, expect } from "@playwright/test";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const website = JSON.parse(JSON.stringify(require("../hidden_data.json"))).job_portal_1


test("First test", async ({ page }) => {
    let reportsText = '';
    await page.goto( website + '/Job/poland-tester-oprogramowania-jobs-SRCH_IL.0,6_IN193_KO7,28.htm' );
    console.log(await page.locator('.SearchResultsHeader_tooltipWrapper__fnh9I h1').innerText());
    let i = 1;
    while(await page.isVisible('.JobsList_buttonWrapper__ticwb div button')) {
        console.log(i);
        await page.click(".JobsList_buttonWrapper__ticwb div button");
        i++;
        await delay(3000);
    }
    console.log("Finished 1-st stage");
    let j = 0;
    while(await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).isVisible()) {
        let linksText = await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).getAttribute('href');
        let publishedText = await page.locator('.JobCard_listingAge__jJsuc').nth(j).innerText();
        reportsText += linksText + '\t' + publishedText + '\n'
        j++;
    }
    console.log(reportsText);
});
 
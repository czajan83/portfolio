declare var require: any
import { test, expect } from "@playwright/test";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const website = JSON.parse(JSON.stringify(require("../hidden_data.json"))).job_portal_1

var fs = require("fs");
var dir_portal = "jobportal_1/";
var dir_jobname = dir_portal + "tester_oprogramowania/"
var dir_details = dir_jobname + "details/"
var job_links = [''];
var max_opening_id = 0;
if(!fs.existsSync(dir_portal)) fs.mkdirSync(dir_portal, 0o744);
if(!fs.existsSync(dir_jobname)) fs.mkdirSync(dir_jobname, 0o744);
if(!fs.existsSync(dir_details)) {
    fs.mkdirSync(dir_details, 0o744);
}
else {
    var job_files = fs.readdirSync(dir_details)
    for (const job_file of job_files) {
        const current_opening_id = Number(job_file.replace(/[^0-9]/g, ''));
        if (max_opening_id < current_opening_id) max_opening_id = current_opening_id;
        const job_opening = JSON.parse(JSON.stringify(require("../" + dir_details + job_file))).link;
        job_links.push(job_opening);
    }
    job_links.shift();
}
   

test("Get the list of job offers", async ({ page }) => {

    // Open the job offers website and test amount of offers
    await page.goto( website + '/Job/poland-tester-oprogramowania-jobs-SRCH_IL.0,6_IN193_KO7,28.htm' );
    let searchResultsText = await page.locator('.SearchResultsHeader_tooltipWrapper__fnh9I h1').innerText();
    let searchResultsNumber = await Number(searchResultsText.replace(/[^0-9]/g, ''))
    await expect(searchResultsNumber).toBeGreaterThan(0);

    // Unhide all the offers by clicking 'show more jobs button'
    let i = 1;
    while(await page.isVisible('.JobsList_buttonWrapper__ticwb div button')) {
        await page.click(".JobsList_buttonWrapper__ticwb div button");
        i++;
        await delay(3000);
    }

    // Get and save job offers headers
    let j = 0;
    let strOpeningList = "[\n"
    while(await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).isVisible()) {
        let job_employer = await page.locator('.EmployerProfile_compactEmployerName__9MGcV').nth(j).innerText();
        let job_title = await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).innerText();
        let job_link = await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).getAttribute('href');
        let job_time_visible = await page.locator('.JobCard_listingAge__jJsuc').nth(j).innerText()
        if(job_link == null) job_link = "";

        // Get job offers only if not seen before
        if(!job_links.includes(job_link)) {
            max_opening_id++;
            let jsonOpeningDetails = {
                link: job_link,
                requirements: ""
            };
            let strOpeningDetails = JSON.stringify(jsonOpeningDetails, null, 2) + "\n";
            fs.writeFile(dir_details + "/opening_" + max_opening_id.toString() + ".json", strOpeningDetails, 'utf8', (err) => {
                if(err) console.log(err);
            });
        };

        //Get job offers current state
        let jsonOpening = {
            employer: job_employer,
            title: job_title,
            link: job_link,
            time_visible: job_time_visible
        }
        let strOpening = JSON.stringify(jsonOpening, null, 2) + ",\n";
        strOpeningList += strOpening;
        j++;
    };
    strOpeningList = strOpeningList.slice(0, -2);
    strOpeningList += "\n]"
    const timestamp = new Date().getTime()
    fs.writeFile(dir_jobname + "/openings_list_" + timestamp.toString() + ".json", strOpeningList, 'utf8', (err) => {
        if(err) console.log(err);
    });
});


test("Get details of the job offers", async({ page }) => {
    console.log(job_links)
})
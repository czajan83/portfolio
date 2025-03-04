declare var require: any
import { test, expect } from "@playwright/test";
import { JobsList } from "../page-objects/job_portal_2_jobs_list";

var fs = require("fs");
var dir_portal = "jobportal_2/";
var dir_jobname = dir_portal + "tester_oprogramowania/"
var dir_details = dir_jobname + "details/"
var jobs = [{link: '', requirements: '', fileName: ""}];
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
        const job_opening = JSON.parse(JSON.stringify(require("../" + dir_details + job_file)));
        jobs.push(job_opening);
    }
}
jobs.shift()
   

test.only("Get the list of job offers", async ({ page }) => {
    let jobsList: JobsList;
    jobsList = new JobsList(page);

    await jobsList.openPage();

    var index = 1
    while( index < 51 ) {
        let strIndex = index.toString();
        console.log(strIndex)
        console.log(await jobsList.getJobItemTitle(strIndex));
        console.log(await jobsList.getJobItemLink(strIndex));
        console.log(await jobsList.getJobItemSalary(strIndex));
        console.log(await jobsList.getJobItemEmployer(strIndex))
        console.log(await jobsList.getJobItemEmployerLink(strIndex))
        console.log(await jobsList.getJobItemSeniorityLevel(strIndex))
        console.log(await jobsList.getJobItemRemoteOption(strIndex))
        index++;
    }
    // let searchResultsText = await jobsList.getJobItemTitle(abc.toString());
    // console.log(searchResultsText)
    // let searchResultsNumber = await Number(searchResultsText.replace(/[^0-9]/g, ''))
    // await expect(searchResultsNumber).toBeGreaterThan(0);

    // // Unhide all the offers by clicking 'show more jobs button'
    // let i = 1;
    // while(await page.isVisible('.JobsList_buttonWrapper__ticwb div button')) {
    //     await page.click(".JobsList_buttonWrapper__ticwb div button");
    //     i++;
    //     await delay(2000);
    // }

    // // Get and save job offers headers
    // let j = 0;
    // let strOpeningList = "[\n"
    // while(await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).isVisible()) {
    //     let job_employer = await page.locator('.EmployerProfile_compactEmployerName__9MGcV').nth(j).innerText();
    //     let job_title = await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).innerText();
    //     let job_link = await page.locator('.JobCard_jobTitle__GLyJ1').nth(j).getAttribute('href');
    //     let job_time_visible = await page.locator('.JobCard_listingAge__jJsuc').nth(j).innerText()
    //     if(job_link == null) job_link = "";

    //     // Get job offers only if not seen before
    //     var jobs_links = ['']
    //     for(const job of jobs) {
    //         jobs_links.push(job.link)
    //     }
    //     if(!jobs_links.includes(job_link)) {
    //         max_opening_id++;
    //         let jsonOpeningDetails = {
    //             link: job_link,
    //             requirements: "",
    //             fileName: dir_details + "opening_" + max_opening_id.toString() + ".json"
    //         };
    //         let strOpeningDetails = JSON.stringify(jsonOpeningDetails, null, 2) + "\n";
    //         fs.writeFile(jsonOpeningDetails.fileName, strOpeningDetails, 'utf8', (err) => {
    //             if(err) console.log(err);
    //         });
    //     };

    //     //Get job offers current state
    //     let jsonOpening = {
    //         employer: job_employer,
    //         title: job_title,
    //         link: job_link,
    //         time_visible: job_time_visible
    //     }
    //     let strOpening = JSON.stringify(jsonOpening, null, 2) + ",\n";
    //     strOpeningList += strOpening;
    //     j++;
    // };
    // strOpeningList = strOpeningList.slice(0, -2);
    // strOpeningList += "\n]"
    // const timestamp = new Date().getTime()
    // fs.writeFile(dir_jobname + "/openings_list_" + timestamp.toString() + ".json", strOpeningList, 'utf8', (err) => {
    //     if(err) console.log(err);
    // });
});

var i = 0;
for(const job of jobs) {
    if(job.requirements == '') {
        test("Get details of the job offer " + i, async({ page }) => {
            console.log(job.fileName);
            await page.goto(job.link);
            var opening_requirements = '';
            const opening_listitems = await page.locator('.JobDetails_jobDescription__uW_fK li').allInnerTexts();
            const opening_paragraphs = await page.locator('.JobDetails_jobDescription__uW_fK p').allInnerTexts();
            for(const opening_listitem of opening_listitems) opening_requirements += opening_listitem + "\n";
            opening_requirements += "\n\n\n";
            for(const opening_paragraph of opening_paragraphs) opening_requirements += opening_paragraph + "\n";
            var jsonOpeningDetails = JSON.parse(JSON.stringify(require("../" + job.fileName)));
            console.log(jsonOpeningDetails)
            jsonOpeningDetails.requirements = opening_requirements;
            const strOpeningDetails = JSON.stringify(jsonOpeningDetails, null, 2) + "\n";
            fs.writeFile(job.fileName, strOpeningDetails, 'utf8', (err) => {
                if(err) console.log(err);
            });
            await delay(30000);
        });
        i++;
    }
}
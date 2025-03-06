declare var require: any
import { test, expect } from "@playwright/test";
import { JobsList } from "../POM/jobDetailsPortal2POM";

var fs = require("fs");
var dir_portal = "jobPortal2/";
var dir_jobname = dir_portal + "testerOprogramowania/"
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
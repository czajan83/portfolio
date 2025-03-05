declare var require: any
import { test, expect } from "@playwright/test";
import { JobsList } from "../POM/jobListPortal2POM";

var fs = require("fs");
var dir_portal = "../jobPortal2/";
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
   

test.only("Get the list of job offers", async ({ page }) => {
    let jobsList: JobsList;
    jobsList = new JobsList(page);

    await jobsList.openPage();

    const jobsListLength = Number(await jobsList.getJobsListLength());
    const jobsCards = Math.ceil(jobsListLength / 50);

    var jobsCardIndex = 0;
    var jobsMaxIndexAtCard = 50;
    var strJobOffersList = '[\n';

    while(jobsCardIndex < jobsCards) {
        var jobIndexAtCard = 1;
        if(jobsCardIndex+1 == jobsCards) jobsMaxIndexAtCard = jobsListLength - (jobsCards * 50);
        while(jobIndexAtCard < jobsMaxIndexAtCard + 1) {
            let strJobIndexAtCard = jobIndexAtCard.toString();
            if(await jobsList.checkIfJobItemExists(strJobIndexAtCard)) {
                console.log(jobsCardIndex * 50 + jobIndexAtCard)
                let jsonJobOffer = {
                    'index': jobsCardIndex * 50 + jobIndexAtCard,
                    'title': await jobsList.getJobItemTitle(strJobIndexAtCard),
                    'link': await jobsList.getJobItemLink(strJobIndexAtCard),
                    'salary': await jobsList.getJobItemSalary(strJobIndexAtCard),
                    'employer': await jobsList.getJobItemEmployer(strJobIndexAtCard),
                    'employerLink': await jobsList.getJobItemEmployerLink(strJobIndexAtCard),
                    'level': await jobsList.getJobItemSeniorityLevel(strJobIndexAtCard),
                    'workplace': await jobsList.getJobItemRemoteOption(strJobIndexAtCard),
                    'keywords': '',
                    'userNote': '',
                    'userNote2': '',
                    'userNote3': '',
                    'userNote4': '',
                    'userNote5': ''
                }
                let strJsonJobOffer = JSON.stringify(jsonJobOffer, null, 2) + ",\n";
                strJobOffersList += strJsonJobOffer;
            }
            jobIndexAtCard++;
        }
        await jobsList.switchToNextCard();
        jobsCardIndex++;
    }

    strJobOffersList = strJobOffersList.slice(0, -2);
    strJobOffersList += "\n]"
    const timestamp = new Date().getTime()
    fs.writeFile(dir_jobname + "/openings_list_" + timestamp.toString() + ".json", strJobOffersList, 'utf8', (err) => {
        if(err) console.log(err);
    });
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
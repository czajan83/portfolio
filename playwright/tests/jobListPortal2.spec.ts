declare var require: any

import { test, expect } from "@playwright/test";
import { JobsListPortal2 } from "../POM/jobListPortal2POM";
import { promises as fs } from 'fs';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


async function createFolder(folderPath: string): Promise<boolean> {
    try {
        await fs.access(folderPath);
        return false;
    }
    catch (error) {
        await fs.createFolder(folderPath);
        return true;
    }

}

var dirPortal = "../jobPortal2/";
var dirJobname = dirPortal + "testerOprogramowania/"
var dirDetails = dirJobname + "details/"
var jobs = [{link: '', requirements: '', fileName: ""}];
var max_opening_id = 0;

createFolder(dirPortal);
createFolder(dirJobname);
if(!createFolder(dirDetails)){
    var jobFiles = fs.readdirSync(dirDetails)
    for (const jobFile of jobFiles) {
        const current_opening_id = Number(jobFile.replace(/[^0-9]/g, ''));
        if (max_opening_id < current_opening_id) max_opening_id = current_opening_id;
        const job_opening = JSON.parse(JSON.stringify(require("../" + dirDetails + jobFile)));
        jobs.push(job_opening);
    }
}
jobs.shift()
   

test.only("Get the list of job offers", async ({ page }) => {
    let jobsList: JobsListPortal2;
    jobsList = new JobsListPortal2(page);

    await jobsList.openPage();
    await jobsList.closeCookiesPopup();
    await jobsList.closeJobiConPopup();

    const jobsListLength = Number(await jobsList.getJobsListLength());
    const jobsCards = Math.ceil(jobsListLength / 50);

    var jobsCardIndex = 0;
    var jobsMaxIndexAtCard = 50;
    var strJobOffersList = '[\n';

    while(jobsCardIndex < jobsCards) {
        console.log(`${jobsCardIndex}, ${jobsCards}`)
        var jobIndexAtCard = 1;
        if(jobsCardIndex+1 == jobsCards) jobsMaxIndexAtCard = jobsListLength - (jobsCards * 50);
        while(jobIndexAtCard < jobsMaxIndexAtCard + 1) {
            let strJobIndexAtCard = jobIndexAtCard.toString();
            if(await jobsList.checkIfJobItemExists(strJobIndexAtCard)) {
                console.log(jobsCardIndex * 50 + jobIndexAtCard)
                await jobsList.closeJobHomeDistansePopup();
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
        if (!await jobsList.switchToNextCard()) jobsCardIndex = jobsCards;
        jobsCardIndex++;
    }

    strJobOffersList = strJobOffersList.slice(0, -2);
    strJobOffersList += "\n]"

    const timestamp = Date.now();
    await fs.writeFile(`${dirJobname}jobsList_${timestamp}.json`, strJobOffersList, 'utf8');
});
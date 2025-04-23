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
        await fs.mkdir(folderPath);
        return true;
    }
}

async function make_folders(keyword: string): Promise<string> {
    var dirPortal = "../jobPortal2/";
    var dirJobname = dirPortal + keyword + "/";
    var dirDetails = dirJobname + "details/";
    
    createFolder(dirPortal);
    createFolder(dirJobname);
    createFolder(dirDetails);

    return dirJobname + '/';
}

async function perform_test(jobsList: JobsListPortal2): Promise <string> {
    await jobsList.closeCookiesPopup();
    await jobsList.closeJobiConPopup();

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
                    'noExperience': await jobsList.getNoExperienceOption(strJobIndexAtCard),
                    'noCvRequired': await jobsList.getNoCvRequired(strJobIndexAtCard),
                    'nightWorkPossible': '',
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

    return strJobOffersList;

}

test("Get the list of job offers: tester oprogramowania", async ({ page }) => {

    const dirJobname = await make_folders('testerOprogramowania')
    let jobsList: JobsListPortal2;
    jobsList = new JobsListPortal2(page);
    await jobsList.openPage('/praca/tester%20oprogramowania;kw');
    const strJobOffersList = await perform_test(jobsList);
    const timestamp = Date.now();
    await fs.writeFile(`${dirJobname}jobsList_${timestamp}.json`, strJobOffersList, 'utf8');

});

test("Get the list of job offers: praca fizyczna wokol Katow Wroclawskich", async ({ page }) => {

    const dirJobname = await make_folders('wokolKatow')
    let jobsList: JobsListPortal2;
    jobsList = new JobsListPortal2(page);
    await jobsList.openPage('/praca/katy%20wroclawskie;wp?rd=30&et=2');
    const strJobOffersList = await perform_test(jobsList);
    const timestamp = Date.now();
    await fs.writeFile(`${dirJobname}jobsList_${timestamp}.json`, strJobOffersList, 'utf8');

});
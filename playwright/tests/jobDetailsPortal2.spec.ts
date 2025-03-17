declare var require: any
import { test, expect } from "@playwright/test";
import { JobDetailsPortal2} from "../POM/jobDetailsPortal2POM";

var fs = require("fs");
const jobsListFilePathForSave = "../jobPortal2/testerOprogramowania/jobsList.json";
const jobsListFilePath = "../../jobPortal2/testerOprogramowania/jobsList.json";
var jobsList = JSON.parse(JSON.stringify(require(jobsListFilePath)));
var jsonData = '';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

test("Get details of the job offers", async({ page }) => {

    let jobDetails: JobDetailsPortal2;
    jobDetails = new JobDetailsPortal2(page);

    var limitIndex = 0;
    var jobIndex = 0;
    
    while(limitIndex < 10 && jobIndex < jobsList.length) {
        var job = jobsList[jobIndex];
        if(job.userNote == '') {

            await jobDetails.openPage(job.link);
            await jobDetails.closeCookiesPopup();
            
            await jobDetails.getJobReqsChildNumber()

            job.userNote = await jobDetails.getJobReqs('1');
            job.userNote2 = await jobDetails.getJobReqs('2');
            jobsList[jobIndex] = job

            limitIndex++;
        }
        jobIndex++;
    }

    jsonData = await JSON.stringify(jobsList);
    fs.writeFile(jobsListFilePathForSave, jsonData, 'utf8', (err) => {
        if (err) {
            console.log(err);
        }
    });
});
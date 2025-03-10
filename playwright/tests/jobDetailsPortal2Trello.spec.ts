declare var require: any
import { test, expect } from "@playwright/test";
import { JobPortal2Trello } from "../POM/jobPortal2TrelloPOM";

var fs = require("fs");
const jobsListFilePathForSave = "../jobPortal2/testerOprogramowania/jobsList.json";
const jobsListFilePath = "../../jobPortal2/testerOprogramowania/jobsList.json";
var jobsList = JSON.parse(JSON.stringify(require(jobsListFilePath)));
var jsonData = '';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let jp2Trello: JobPortal2Trello;


test("Post job offer into trello tasks", async({ request }) => {

    jp2Trello = new JobPortal2Trello(request);

    await jp2Trello.refreshBoardId();
    await jp2Trello.refreshToDoListId();
    await jp2Trello.refreshStationaryListId();
    await jp2Trello.printObjectsNamesIds();

    var limitIndex = 0;
    var jobIndex = 0;
    
    while(limitIndex < 10 && jobIndex < jobsList.length) {
        var job = jobsList[jobIndex];
        if(job.userNote3 == '') {
            if(job.workplace.includes('Praca zdalna') || job.workplace.includes('Praca hybrydowa')) await jp2Trello.addCardToToDoList(job.title, job.link);
            else await jp2Trello.addCardToStationaryList(job.title, job.link);
            job.userNote3 = 'done';
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
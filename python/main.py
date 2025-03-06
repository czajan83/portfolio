import json
import os
from datetime import datetime

workFolder = f"/git/portfolio/jobPortal2/testerOprogramowania/"
jobsListFile = workFolder + f"jobsList.json"

genericFileContent = []
if os.path.isfile(f"/git/portfolio/jobPortal2/testerOprogramowania/openingsList.json"):
    with open("../portfolio/playwright/jobportal_1/tester_oprogramowania/openings_list.json", "r") as gfl:
        genericFileContent = json.load(gfl)

filesFolder = os.listdir(f"../portfolio/playwright/jobportal_1/tester_oprogramowania/")

for fileName in sorted(filesFolder):
    print(fileName)
    if fileName != "openings_list.json" and os.path.isfile(f"../portfolio/playwright/jobportal_1/tester_oprogramowania/" + fileName):
        strTimeStamp = datetime.fromtimestamp(float(fileName[14:][:-5]) / 1e3).strftime(f"%Y-%m-%d %H:%M:%S")
        with open("../portfolio/playwright/jobportal_1/tester_oprogramowania/" + fileName, "r") as fl:
            fileContent = json.load(fl)
            for fileDict in fileContent:
                entryExists = False
                for genericFileDict in genericFileContent:
                    if genericFileDict["link"] == fileDict["link"]:
                        genericFileDict["visibility"].update({strTimeStamp: fileDict["time_visible"]})
                        entryExists = True
                        continue
                if not entryExists:
                    genericFileDict = {
                        "employer": fileDict[f"employer"],
                        "title": fileDict[f"title"],
                        "link": fileDict[f"link"],
                        "visibility": {strTimeStamp: fileDict["time_visible"]},
                        "user_annotations": {strTimeStamp: "Pierwsze pojawienie się ogłoszenia w portalu"},
                        "recruitment_status": ""
                    }
                    genericFileContent.append(genericFileDict)
for fileName in sorted(filesFolder):
    if fileName != "openings_list.json" and os.path.isfile(f"../portfolio/playwright/jobportal_1/tester_oprogramowania/" + fileName):
        os.replace(f"../portfolio/playwright/jobportal_1/tester_oprogramowania/" + fileName, f"../portfolio/playwright/jobportal_1/tester_oprogramowania/backup/" + fileName)


with open("../portfolio/playwright/jobportal_1/tester_oprogramowania/openings_list.json", "w", encoding=f"utf-8") as fs:
    json.dump(genericFileContent, fs, ensure_ascii=False, indent=4)
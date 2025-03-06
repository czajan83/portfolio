import json
import os

workFolder = f"/git/portfolio/jobPortal2/testerOprogramowania/"

filesInFolder = os.listdir(workFolder)
jobsListFileName = f"jobsList.json"

for fileName in sorted(filesInFolder):
    print(fileName)
    if fileName != jobsListFileName and os.path.isfile(workFolder + fileName):
        with open(workFolder + fileName, "r") as fr:
            fileContent = json.load(fr)
            for fileDict in fileContent:
                fileDict["link"] = fileDict["link"].split(f"?s=")[0]
                fileDict["employerLink"] = fileDict["employerLink"].split(f"?pid=")[0]
        with open(workFolder + fileName, "w") as fs:
            json.dump(fileContent, fs, ensure_ascii=False, indent=4)
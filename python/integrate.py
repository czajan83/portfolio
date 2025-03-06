import json
import os

workFolder = f"/git/portfolio/jobPortal2/testerOprogramowania/"
backupFolderName = f"backup"
jobsListFileName = f"jobsList.json"
jobsListFile = workFolder + jobsListFileName

if not os.path.exists(workFolder + backupFolderName):
    os.makedirs(workFolder + backupFolderName)

genericFileContent = []
if os.path.isfile(jobsListFile):
    with open(jobsListFile, "r") as gfl:
        genericFileContent = json.load(gfl)

index = len(genericFileContent)

filesInFolder = os.listdir(workFolder)

for fileName in sorted(filesInFolder):
    print(fileName)
    if fileName != jobsListFileName and os.path.isfile(workFolder + fileName):
        with open(workFolder + fileName, "r") as fl:
            fileContent = json.load(fl)
            for fileDict in fileContent:
                exists = False
                for genericFileDict in genericFileContent:
                    if genericFileDict[f"link"] == fileDict[f"link"]:
                        exists = True
                if not exists:
                    fileDict["index"] = str(index)
                    index += 1
                    genericFileContent.append(fileDict)

for fileName in sorted(filesInFolder):
    if fileName != jobsListFileName and os.path.isfile(workFolder + fileName):
        os.replace(workFolder + fileName, workFolder + backupFolderName + f"/" + fileName)


with open(jobsListFile, "w", encoding=f"utf-8") as fs:
    json.dump(genericFileContent, fs, ensure_ascii=False, indent=4)
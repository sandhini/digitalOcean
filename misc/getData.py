import csv
import re
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from time import gmtime, strftime

def get_hours(row):
    finVal = 0
    for i in range(6,len(row)):
        val = row[i]
        val = re.sub("[^0-9]", "", val)
        if val == "":
            continue
        val = int(val)
        finVal += val
    return finVal

def get_data(fileName, team):
    nameMap = {}
    projectMap = {}
    nameIndex = 0
    managerIndex = 2
    positionIndex = 3
    projectIndex = 4
    with open(fileName) as csvfile:
        reader = csv.reader(csvfile)
        for i, row in enumerate(reader):
            if i < 2:
                continue
            name = row[nameIndex].strip()
            name = name.split(", ")
            if len(name)<2:
                continue
            name = name[1]+" " +name[0]
            project = row[projectIndex].strip()
            if name in nameMap:
                personInformation = nameMap[name]
                personInformation['projects'].append(project)
                nameMap[name] = personInformation
            else:
                newMap = {}
                newMap["projects"] = [project]
                newMap['manager'] = row[managerIndex].strip()
                newMap['position'] = row[positionIndex].strip()
                newMap['team'] = team
                nameMap[name] = newMap
            if project in projectMap:
                projInformation = projectMap[project]
                projInformation['numPeople'] += 1
                projInformation['people'].append(name)
                finVal = get_hours(row)
                projInformation['numHours'] += finVal
                projectMap[project] = projInformation
            else:
                newMap = {}
                newMap['numPeople'] = 1
                newMap['people'] = [name]
                finVal = get_hours(row)
                newMap['numHours'] = finVal
                projectMap[project] = newMap
    return projectMap, nameMap

def write_sheet(nameMap, sheet):
    for val in nameMap:
        timeStamp = strftime("%m/%d/%Y %H:%M:%S", gmtime())
        information = nameMap[val]
        projects = str(information['projects'])
        row = [timeStamp, val, information['position'], information['manager'],"None", projects, information['team']]
        index = 2
        sheet.insert_row(row, index)

def main():
    #projectMapStorage, nameMapStorage = get_data('software1.csv', 'Storage')
    #projectMapN, nameMapN = get_data('Networking.csv', 'Networking')
    #projectMapC, nameMapC = get_data('Compute.csv', 'Compute')
    #projectMapB, nameMapB = get_data('Billing.csv', 'Billing')
    projectMapD, nameMapD = get_data('DevEx.csv', 'DevEx')
    #projectMapBITS, nameMapBITS = get_data('BITS.csv', 'Bus Internal Tools')
    #projectMapI, nameMapI = get_data('Infra_TAPS.csv', 'Infrastructure')
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('Eng Org-9ec28cd12be9.json', scope)
    client = gspread.authorize(creds)

    # Find a workbook by name and open the first sheet
    # Make sure you use the right name here.
    sheet = client.open("Eng Org Chart").sheet1
    #write_sheet(nameMapStorage, sheet)
    #write_sheet(nameMapBITS, sheet)
    #write_sheet(nameMapI, sheet)
    #write_sheet(nameMapN, sheet)

    #write_sheet(nameMapC, sheet)
    #write_sheet(nameMapB, sheet)
    write_sheet(nameMapD, sheet)


if __name__ == '__main__':
    main()

NUMBER_NON_NAME_QUESTIONS = 5
NEW_FORM_SUBMIT_LOCATION = 2
function noDuplicates(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var inputL = doc.getRange("B:B").getValues();
  var position = doc.getRange("C:C").getValues();
  var mapItem = {}
  var dupList = []
  var delList = []
  for (var i=0;i<=inputL.length;i++){
    item = inputL[i]
    item = item
    if (item == ""){
      break;
    }
    if (item in mapItem){
      dupList.push(i+1)
      dupList.push(mapItem[item])
      }
    else{
      mapItem[item] = i+1
      }
  }
   nums = removeDuplicates(inputL, dupList, delList)
   return ;
}

function getTime(num1, num2){
  num1 = num1.split()
  num2 = num2.split()
  date1 = num1[0]
  time1 = num1[1]
  date2 = num2[0]
  time2 = num2[1]
  var parts1 = date1.split('/');
  var parts2 = date2.split('/');
  var date1 = new Date(parts1[2], parts1[0] - 1, parts1[1]);
  var date2 = new Date(parts2[2], parts2[0] - 1, parts2[1]);
  if (parts1 == parts2){
    var partsT1 = time1.split(':');
    var partsT2 = time2.split(':');
    var date1 = new Date(parts1[2], parts1[0] - 1, parts1[1],partsT1[0],partsT1[1],partsT1[2] );
    var date2 = new Date(parts2[2], parts2[0] - 1, parts2[1],partsT2[0],partsT2[1],partsT2[2]);
  }
  return (date1, date2)
}

function removeDuplicates(inputL, dupList, delList){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var timeInput = doc.getRange("A:A").getValues();
  var position = doc.getRange("C:C").getValues();
  for (var i=0;i<dupList.length;i+=2){
    item = dupList[i]
    item2 = dupList[i+1]
    if (item == NEW_FORM_SUBMIT_LOCATION){
      oldProjects = item2
      newProjects = item
    }
    else{
    oldProjects = item
    newProjects = item2
    }
    var newRowIn = newRowInformation(oldProjects, newProjects)
    var newRow = newRowIn[0]
    var numNull = newRowIn[1]
    delList.push(Number(item2))
    delList.push(Number(item))
  }
   delList = delList.sort(function(a, b){return a-b});
   for (var i=0;i<delList.length;i++){
     doc.deleteRow(delList[i]-i);
   }
   if (numNull<NUMBER_NON_NAME_QUESTIONS){
      doc.appendRow(newRow)
  }
    return delList;
}


function changeProjects(oldProjects, newProjects){
  if (newProjects == "")
    return oldProjects
   newProjects = newProjects.split(",")
   oldProjects = oldProjects.split(",")

   for(var i = 0; i<newProjects.length;i++){
     currProj = newProjects[i]
     var found = false
     for (var j = 0; j < oldProjects.length;j++){
       var proj = oldProjects[j].trim()
       proj = proj.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");
       currProj = currProj.trim()
       currProj = currProj.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");
       if(proj == currProj){
         oldProjects.splice(j,1)
         found = true
         break;
       }
     }

     if (!found){
       oldProjects.push(" "+currProj)
     }
   }
   return oldProjects.toString()
}

  function getRowVal(oldRow, newRow){
    var colRange = ["A", "B", "C", "D", "E", "F", "G"]
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var row1Fin = []
    var row2Fin = []
    for (var val in colRange){
      val = colRange[val]
      var row1 = doc.getRange(val+oldRow+":"+val+oldRow).getValue()
      var row2 = doc.getRange(val+newRow+":"+val+newRow).getValue()
      if (val == "A"){

      }
      else{
        row1 = row1.toString()
        row2 = row2.toString()
      }
      row1Fin.push(row1)
      row2Fin.push(row2)
    }
    return [row1Fin, row2Fin]
  }

function newRowInformation(oldRow, newRow){
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var rows = getRowVal(oldRow, newRow)
    var row1 = rows[0]
    var row2 = rows[1]
    var newList = []
    var numNull = 0
    for (var i = 0; i < row1.length; i ++){
      var firstVal = row1[i]
      var secondVal = row2[i]
      if (secondVal == ""){
        newList.push(firstVal)
        numNull += 1
      }
      else{
        if (i == 5){
          var proj = changeProjects(firstVal, secondVal)
          newList.push(proj)

        }
        else
          newList.push(secondVal)
       }
    }
    return [newList, numNull]
}
      

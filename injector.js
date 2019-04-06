function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var tableElements = document.getElementById('timesheettable').children;
var firstTimeSheetRow = tableElements[3];
var client = firstTimeSheetRow.children[0].children[2].innerText;
var phase = firstTimeSheetRow.children[0].children[3].innerText;
var stage = firstTimeSheetRow.children[0].children[4].innerText;
var project = firstTimeSheetRow.children[1].children[0].children[0].value
console.clear();
console.log('CAPLINFX.001 Caplin > FX Solutions > FX Professional-Maintenance');
console.log(phase, client, ">", project+"-"+stage);

for (var i=7; i < 14; i++) {
    tableElements[0].children[1].children[i].onclick = function() {
        var element = tableElements[0].children[1].children[i];
        var day = element.children[0].children[2].innerHTML;
        var month = element.children[0].children[1].innerHTML;
        var year = "20" + element.children[0].children[0].innerHTML;
        return function() {alert(day + " " + month + " " + year + " was just cliked")};
    }()
}




var newTableBody = document.createElement('tbody');
var newTableRow = document.createElement('tr');
var newTableElement = document.createElement('td');
newTableElement.colSpan = "15";
newTableRow.appendChild(newTableElement);
newTableBody.appendChild(newTableRow);
insertAfter(firstTimeSheetRow, newTableBody)

for (var i=0; i < 6; i++) {
    var newJiraTicket = document.createElement('div');
    var topRow = document.createElement('div');
    topRow.innerHTML = "PLIBS-1000 - 1.5hrs";
    var middleRow = document.createElement('div');
    middleRow.style= "width: 200px; white-space: normal;"
    middleRow.innerHTML = "Hello this is a really long summary i wonder how it will look";
    var bottomRow = document.createElement('div');
    bottomRow.innerHTML = "9:21am-11:41am - In Development";
    newJiraTicket.style = "float: left; display:inline-block; margin: 10px; width: 200px; overflow:hidden; border: 1px solid black; padding: 5px;";
    newJiraTicket.appendChild(topRow);
    newJiraTicket.appendChild(middleRow);
    newJiraTicket.appendChild(bottomRow);
    newTableElement.appendChild(newJiraTicket);
}


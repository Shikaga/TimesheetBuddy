function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var monthMap = {
    "Jan": "January",
    "Feb": "February",
    "Mar": "March",
    "Apr": "April",
    "May": "May",
    "Jun": "June",
    "Jul": "July",
    "Aug": "August",
    "Sep": "September",
    "Oct": "October",
    "Nov": "November",
    "Dec": "December"
}

function addClickEventsToDate() {
    var tableElements = document.getElementById('timesheettable').children;
    for (var i=7; i < 14; i++) {
        tableElements[0].children[1].children[i].onclick = function() {
            var element = tableElements[0].children[1].children[i];
            var day = element.children[0].children[2].innerHTML;
            var month = element.children[0].children[1].innerHTML;
            var year = "20" + element.children[0].children[0].innerHTML;
            return function() {
                var existingRows = document.getElementsByClassName('myRows');
                for (var i=0; i < existingRows.length; i++) {
                    var element = existingRows[i];
                    element.parentNode.removeChild(element);
                    addCardsToRow(2 + Math.floor(Math.random() * 5));
                }
                alert(day + " " + monthMap[month] + " " + year + " was just cliked")
            };
        }()
    }
}

function getCardDiv(jiraId, jiraSummary, timeElapsed, duration, status) {
    var newJiraTicket = document.createElement('div');
    newJiraTicket.style = "float: left; display:inline-block; margin: 10px; width: 200px; overflow:hidden; border: 1px solid black; padding: 5px;";
    
    var topRow = document.createElement('div');
    topRow.innerHTML = jiraId + " - " + timeElapsed;
    var middleRow = document.createElement('div');
    middleRow.style= "width: 200px; white-space: normal;"
    middleRow.innerHTML = jiraSummary;
    var bottomRow = document.createElement('div');
    bottomRow.innerHTML = duration + " - " + status;
    
    newJiraTicket.appendChild(topRow);
    newJiraTicket.appendChild(middleRow);
    newJiraTicket.appendChild(bottomRow);
    return newJiraTicket;
}

function getRowInfo(rowId) {
    var tableElements = document.getElementById('timesheettable').children;
    var row = tableElements[rowId];
    var client = row.children[0].children[2].innerText;
    var phase = row.children[0].children[3].innerText;
    var stage = row.children[0].children[4].innerText;
    var project = row.children[1].children[0].children[0].value
    var currentValues = [];
    for (var i=7; i < 14; i++) {
        currentValues.push(row.children[0].children[i].children[2].children[0].value)
    }
    return {client, phase, stage, project, currentValues};
}

function setRowData(rowId, data) {
    var tableElements = document.getElementById('timesheettable').children;
    var row = tableElements[rowId];
    for (var i=0; i < 7; i++) {
        if (data[i]) {
            row.children[0].children[7+i].children[2].children[0].value = data[i];
        }
    }
}

function addCardsToRow(rowId) {
    var tableElements = document.getElementById('timesheettable').children;
    var row = tableElements[rowId];
    
    var newTableBody = document.createElement('tbody');
    newTableBody.className = "myRows";
    var newTableRow = document.createElement('tr');
    var newTableElement = document.createElement('td');
    newTableElement.colSpan = "15";
    newTableRow.appendChild(newTableElement);
    newTableBody.appendChild(newTableRow);
    insertAfter(row, newTableBody)
    
    for (var i=0; i < 3; i++) {
        newTableElement.appendChild(getCardDiv("PLIBS-1000", 
        "Hello this is a really long summary i wonder how it will look", 
        "1.5hrs",
        "9:21am-11:41am",
        "In Development"));
    }
}

addClickEventsToDate();
addCardsToRow(3);
console.log(getRowInfo(3));
setRowData(3, [
    null,
    2,
    null,
    4,
    null, 
    null,
    null
]);




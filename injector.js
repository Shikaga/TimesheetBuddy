function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertBefore(referenceNode, newNode) {
    referenceNode.insertBefore(newNode, referenceNode.firstChild);
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
    if (!row.children[0].children[2]) {
        return null;
    }
    var client = row.children[0].children[2].innerText;
    var phase = row.children[0].children[3].innerText;
    var stage = row.children[0].children[4].innerText;
    if (!row.children[1]) {
        return null;
    }
    var project = row.children[1].children[0].children[0].value
    var currentValues = [];
    for (var i=7; i < 14; i++) {
        if (!row.children[0].children[i].children[2]) {
            return null;
        }
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

function addCardsToRow(rowId, card) {
    var tableElements = document.getElementById('timesheettable').children;
    var row = tableElements[rowId];
    var nextRow = tableElements[rowId+1];
    if (nextRow.className == "myRows") {
        
    } else {
        nextRow = document.createElement('tbody');
        nextRow.className = "myRows";
        nextRow.style = "display: inline-flex;"
        var newTableRow = document.createElement('tr');
        var newTableElement = document.createElement('td');
        newTableElement.colSpan = "15";
        newTableRow.appendChild(newTableElement);
        nextRow.appendChild(newTableRow);
        insertAfter(row, nextRow)
    }
    
    nextRow.appendChild(card);
}

function getRowIdFromTimesheet(timesheetString) {
    var rowCount = document.getElementById('timesheettable').children;
    for (var i=0; i<rowCount.length; i++) {
        if (getRowInfo(i)) {
            var rowInfo = getRowInfo(i);
            var rowString = rowInfo.phase + " " + rowInfo.client + " - " + rowInfo.project + "-" + rowInfo.stage;
            if (timesheetString == rowString) {
                return i;
            }
        }
    }
    return -1;
}

function addLoginPanel() {
    var headerBar = document.getElementById('TSWOptions');
    var loginPanel = document.createElement('div');

    var usernameLabel = document.createElement('span');
    usernameLabel.innerHTML = "Username";
    var username = document.createElement('input');
    username.value = localStorage.getItem('username');

    var passwordLabel = document.createElement('span');
    passwordLabel.innerHTML = "Password";
    var password = document.createElement('input');
    password.type = "password";
    password.value = localStorage.getItem('password');

    var projectsLabel = document.createElement('span');
    projectsLabel.innerHTML = "Project";
    var projects = document.createElement('input');
    projects.value = localStorage.getItem('projects') || "FXM,MFXMOTIF,FXST,PCTLIBRARY,CT5UP,PTGUI";

    var loginButton = document.createElement('button');
    loginButton.innerHTML = "Login"
    loginButton.onclick = function() {
        localStorage.setItem('username', username.value);
        localStorage.setItem('password', password.value);
        localStorage.setItem('projects', projects.value);
        loadData(username.value, password.value, projects.value.split(','));
    }

    loginPanel.appendChild(usernameLabel);
    loginPanel.appendChild(username);
    loginPanel.appendChild(passwordLabel);
    loginPanel.appendChild(password);
    loginPanel.appendChild(projectsLabel);
    loginPanel.appendChild(projects);
    loginPanel.appendChild(loginButton);
    
    insertBefore(headerBar, loginPanel);
}

function loadData(username, password, projectIds) {
    getDataWithJSON(function(response) {
        handleResponse(response, username); //change this when testing
    }, username, password,
      "https://jira.caplin.com/rest/api/latest/search?jql=updatedDate > -10d AND (" + projectIds.map(function(e) {return "project = " + e}).join(" OR ") + ") &maxResults=1000&expand=changelog");
}

function handleResponse(response, user) {
    window.sameDay = function(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
      }


      window.last10days = Array.from({length:10},(v,k)=>k).map(function(v) {
        var date = new Date();
        date.setDate(date.getDate() - v);
        return {date, events: {}};
      })
      
      var data = JSON.parse(response.target.response);
      var yourData = data.issues.filter(function(issue) {
        for (var j=0; j < issue.changelog.histories.length; j++) {
          var change = issue.changelog.histories[j];
          for (var i=0; i < change.items.length; i++) {
            if (change.items[i].field == "assignee") {
              if (change.items[i].from == user) return true;
              if (change.items[i].to == user) return true;
            }
          }
        }
        return false;
      });
      console.log("Total issues worked on in last 10 days:", data.issues.length);
      console.log("Issues you have worked on in last 10 days:", yourData.length);
      yourData.map(function(issue) {
        for (var i=0; i < issue.changelog.histories.length; i++) {
          if (issue.changelog.histories[i].items.filter(function(item) {return item.field == "status"}).length > 0) {
          } 
          else {
            if (issue.changelog.histories[i-1] && issue.changelog.histories[i-1].items.filter(function(item) {return item.field == "status"}).length > 0) {
              issue.changelog.histories[i].items.push(
                {field: "status", 
                fromString: issue.changelog.histories[i-1].items.filter(function(item) {return item.field == "status"}).map(function(item) {return item.fromString})[0],
                toString: issue.changelog.histories[i-1].items.filter(function(item) {return item.field == "status"}).map(function(item) {return item.toString})[0]
                })
            }
          }
          if (issue.changelog.histories[i].items.filter(function(item) {return item.field == "assignee"}).length > 0) {
          } 
          else {
            if (issue.changelog.histories[i-1] && issue.changelog.histories[i-1].items.filter(function(item) {return item.field == "assignee"}).length > 0) {
              issue.changelog.histories[i].items.push(
                {field: "assignee", 
                from: issue.changelog.histories[i-1].items.filter(function(item) {return item.field == "assignee"}).map(function(item) {return item.from})[0],
                to: issue.changelog.histories[i-1].items.filter(function(item) {return item.field == "assignee"}).map(function(item) {return item.to})[0]
                })
            }
          }
        }
      issue.changelog.histories.map(function(change) {
        change.items.map(function(fieldChanged) {
          if (fieldChanged.field=="status" && change.items.filter(function(item) {return item.field == "assignee"})[0] && change.items.filter(function(item) {return item.field == "assignee"})[0].to == user) {
            for (var i=0; i < window.last10days.length; i++) {
              if (window.sameDay(window.last10days[i].date, new Date(Date.parse(change.created)))) {
                window.last10days[i].events[issue.key+":"+issue.fields.summary+":"+issue.fields.customfield_11670] = window.last10days[i].events[issue.key+":"+issue.fields.summary+":"+issue.fields.customfield_11670] || [];
                window.last10days[i].events[issue.key+":"+issue.fields.summary+":"+issue.fields.customfield_11670].push({
                  toString: function() {return  this.event + " - " + this.time.getHours() + ":" + this.time.getMinutes()},
                  event: fieldChanged.fromString + " -> " + fieldChanged.toString,
                  time: new Date(Date.parse(change.created))
                })
              }
            }
            
          }
        }.bind(this))
      }.bind(this));

      })



      window.days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      window.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

      window.last10days.map(function(day) {
        console.log(window.days[day.date.getDay()], day.date.getDate(), window.months[day.date.getMonth()]);	
        Object.keys(day.events).forEach(function(jiraId,index) {
          console.log(" ", jiraId);
          var jira = day.events[jiraId];
          jira.map(function(event) {
              var rowId = getRowIdFromTimesheet(jiraId.split(":")[2]);
              console.log(rowId, jira, jiraId);
              if (rowId > -1) {
                addCardsToRow(rowId, getCardDiv(jiraId.split(":")[0], 
                jiraId.split(":")[1], 
                "???hrs",
                event.time.toString().split(" ").slice(0,5).join(" ") + "-???",
                event.event.split("->")[1].trim()));
              } else {
                addCardsToRow(0, getCardDiv(jiraId.split(":")[0], 
                jiraId.split(":")[1], 
                "???hrs",
                event.time.toString().split(" ").slice(0,5).join(" ") + "-???",
                event.event.split("->")[1].trim()));
              }
              
            //   console.log(jiraId.split(":")[2]);
            //   if (getRowInfo(5))
            //   console.log(getRowInfo(5).phase + " " + getRowInfo(5).client + " - " + getRowInfo(5).project + "-" + getRowInfo(5).stage)
            console.log("  ", event.toString());
          })
          
        });
      })
}

getDataWithJSON = function(callback, username, password, requestUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + requestUrl)
    if (this.username !== "") {
      this.setAuthorizationHeader(xhr, username, password);
    }
    xhr.setRequestHeader("x-requested-with", "love");
    xhr.send();
    xhr.onload = function(response) {
      if (this.status === 401) {
        callback(this.status);
      } else {
        callback(response);
      }
    }
  };

setAuthorizationHeader = function(xhr, username, password) {
    var authHeader = "Basic "+btoa(username + ":" + password);
    xhr.setRequestHeader("Authorization", authHeader);
}

addClickEventsToDate();
setRowData(3, [
    null,
    2,
    null,
    4,
    null, 
    null,
    null
]);
addLoginPanel();
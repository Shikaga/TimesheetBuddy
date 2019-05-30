var newScript = document.createElement("script");
newScript.type = "text/javascript";
newScript.src = window.damJSDomain + "/utils/DataExtractor.js";
document.getElementsByTagName("head")[0].appendChild(newScript);

newScript = document.createElement("script");
newScript.type = "text/javascript";
newScript.src = window.damJSDomain + "/utils/DataConverter.js";
document.getElementsByTagName("head")[0].appendChild(newScript);

newScript = document.createElement("script");
newScript.type = "text/javascript";
newScript.src = window.damJSDomain + "/utils/statuses.js";
document.getElementsByTagName("head")[0].appendChild(newScript);

newScript = document.createElement("script");
newScript.type = "text/javascript";
newScript.src = window.damJSDomain + "/lib/fullcalendar/core/main.js";
document.getElementsByTagName("head")[0].appendChild(newScript);

newScript = document.createElement("link");
newScript.rel = "stylesheet";
newScript.href = window.damJSDomain + "/lib/fullcalendar/core/main.css";
document.getElementsByTagName("head")[0].appendChild(newScript);

newScript = document.createElement("link");
newScript.rel = "stylesheet";
newScript.href = window.damJSDomain + "/lib/fullcalendar/timegrid/main.css";
document.getElementsByTagName("head")[0].appendChild(newScript);

newScript = document.createElement("link");
newScript.rel = "stylesheet";
newScript.href = window.damJSDomain + "/lib/fullcalendar/daygrid/main.css";
document.getElementsByTagName("head")[0].appendChild(newScript);

newScript = document.createElement("link");
newScript.rel = "stylesheet";
newScript.href = window.damJSDomain + "/lib/fullcalendar/list/main.css";
document.getElementsByTagName("head")[0].appendChild(newScript);

setTimeout(function() {
  newScript = document.createElement("script");
  newScript.type = "text/javascript";
  newScript.src = window.damJSDomain + "/lib/fullcalendar/interaction/main.js";
  document.getElementsByTagName("head")[0].appendChild(newScript);
},100);

setTimeout(function() {
  newScript = document.createElement("script");
  newScript.type = "text/javascript";
  newScript.src = window.damJSDomain + "/lib/fullcalendar/daygrid/main.js";
  document.getElementsByTagName("head")[0].appendChild(newScript);
},200);

setTimeout(function() {
  newScript = document.createElement("script");
  newScript.type = "text/javascript";
  newScript.src = window.damJSDomain + "/lib/fullcalendar/timegrid/main.js";
  document.getElementsByTagName("head")[0].appendChild(newScript);
},300);

var months = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
};

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertBefore(referenceNode, newNode) {
  referenceNode.insertBefore(newNode, referenceNode.firstChild);
}

function roundTimeQuarterHour(time) {
  var timeToReturn = new Date(time);

  timeToReturn.setMilliseconds(Math.round(time.getMilliseconds() / 1000) * 1000);
  timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
  timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15);
  return timeToReturn;
}

var monthMap = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December"
};

function addClickEventsToDate() {
  var tableElements = document.getElementById("timesheettable").children;
  for (var i = 7; i < 14; i++) {
    tableElements[0].children[1].children[i].onclick = (function() {
      var element = tableElements[0].children[1].children[i];
      var day = element.children[0].children[2].innerHTML;
      var month = element.children[0].children[1].innerHTML;
      var year = "20" + element.children[0].children[0].innerHTML;
      return function() {
        var existingRows = document.getElementsByClassName("myRows");
        for (var i = 0; i < existingRows.length; i++) {
          var element = existingRows[i];
          element.parentNode.removeChild(element);
          addCardsToRow(2 + Math.floor(Math.random() * 5));
        }
        alert(day + " " + monthMap[month] + " " + year + " was just cliked");
      };
    })();
  }
}

function getCardDiv(jiraId, jiraSummary, timeElapsed, duration, status, onclick) {
  var newJiraTicket = document.createElement("div");
  newJiraTicket.onclick = function() {
    onclick();
    newJiraTicket.style.display = "none";
  }
  newJiraTicket.style =
    "float: left; display:inline-block; margin: 10px; width: 200px; overflow:hidden; border: 1px solid black; padding: 5px;";

  var topRow = document.createElement("div");
  topRow.innerHTML = `<a href="https://jira.caplin.com/browse/${jiraId}" target="_blank">${jiraId}</a> - ${timeElapsed}`;
  var middleRow = document.createElement("div");
  middleRow.style = "width: 200px; white-space: normal;";
  middleRow.innerHTML = jiraSummary;
  var bottomRow = document.createElement("div");
  bottomRow.innerHTML = duration + " - " + status;

  newJiraTicket.appendChild(topRow);
  newJiraTicket.appendChild(middleRow);
  newJiraTicket.appendChild(bottomRow);
  return newJiraTicket;
}

function getRowInfo(rowId) {
  var tableElements = document.getElementById("timesheettable").children;
  var row = tableElements[rowId];
  if (!row.children[0].children[2]) {
    return null;
  }
  var client = row.children[0].children[2].innerText;
  var phase = row.children[0].children[3].innerText.replace("Open in tab", "");
  var stage = row.children[0].children[4].innerText;
  if (!row.children[1]) {
    return null;
  }
  var project = row.children[1].children[0].children[0].value;
  var currentValues = [];
  for (var i = 7; i < 14; i++) {
    if (!row.children[0].children[i].children[2]) {
      return null;
    }
    if (!row.children[0].children[i].children[2].children[0]) {
      return null;
    }
    currentValues.push(
      row.children[0].children[i].children[2].children[0].value
    );
  }
  return { client, phase, stage, project, currentValues };
}

function setRowData(rowId, data) {
  for (var i = 0; i < 7; i++) {
    if (data[i]) {
      addCellData(rowId, i, Math.round((data[i]) * 100) / 100)
    }
  }
}

function addCellData(rowId, dayOfWeekNum, hoursToAdd) {
  var tableElements = document.getElementById("timesheettable").children;
  var row = tableElements[rowId];
  const box = row.children[0].children[7 + dayOfWeekNum].children[2].children[0];
  var currentHours = Number.parseFloat(box.value) || 0;
  if (hoursToAdd !== undefined && hoursToAdd !== null) {
    box.value = currentHours + hoursToAdd;
    Data_ChangedW(box);
  }
}

function addCardsToRow(rowId, card) {
  var tableElements = document.getElementById("timesheettable").children;
  var row = tableElements[rowId];
  var nextRow = tableElements[rowId + 1];
  if (nextRow.className == "myRows") {
  } else {
    nextRow = document.createElement("tbody");
    nextRow.className = "myRows";
    nextRow.style = "display: inline-flex;";
    var newTableRow = document.createElement("tr");
    var newTableElement = document.createElement("td");
    newTableElement.colSpan = "15";
    newTableRow.appendChild(newTableElement);
    nextRow.appendChild(newTableRow);
    insertAfter(row, nextRow);
  }

  nextRow.appendChild(card);
}

function getRowIdFromTimesheet(timesheetString) {
  var rowCount = document.getElementById("timesheettable").children;
  for (var i = 0; i < rowCount.length; i++) {
    if (getRowInfo(i)) {
      var rowInfo = getRowInfo(i);
      var rowString =
        rowInfo.phase +
        " " +
        rowInfo.client +
        " - " +
        rowInfo.project +
        "-" +
        rowInfo.stage;
      if (timesheetString == rowString) {
        return i;
      }
    }
  }
  return -1;
}

function addLoginPanel() {
  var headerBar = document.getElementById("TSWOptions");
  var loginPanel = document.createElement("div");

  var usernameLabel = document.createElement("span");
  usernameLabel.innerHTML = "Username";
  var username = document.createElement("input");
  username.value = localStorage.getItem("username");

  var passwordLabel = document.createElement("span");
  passwordLabel.innerHTML = " Password";
  var password = document.createElement("input");
  password.type = "password";
  password.value = localStorage.getItem("password");

  var rememberPasswordLabel = document.createElement("span");
  rememberPasswordLabel.innerHTML = " Remember password? ";
  var rememberPassword = document.createElement("input");
  rememberPassword.type = "checkbox";
  rememberPassword.checked = !!localStorage.getItem("password");

  var emailLabel = document.createElement("span");
  emailLabel.innerHTML = "Email";
  var email = document.createElement("input");
  email.value = localStorage.getItem("email");

  var projectsLabel = document.createElement("span");
  projectsLabel.innerHTML = " Project";
  var projects = document.createElement("input");
  projects.value =
    localStorage.getItem("projects") ||
    "FXM,MFXMOTIF,FXST,PCTLIBRARY,CT5UP,PTGUI";

  var loginButton = document.createElement("button");
  loginButton.innerHTML = "Login";
  loginButton.onclick = function() {
    localStorage.setItem("username", username.value);
    if (rememberPassword.checked) {
      localStorage.setItem("password", password.value);
    }
    localStorage.setItem("email", email.value);
    localStorage.setItem("projects", projects.value);
    loadData(username.value, password.value, username.value, email.value, projects.value.split(","));
  };

  loginPanel.appendChild(usernameLabel);
  loginPanel.appendChild(username);
  loginPanel.appendChild(passwordLabel);
  loginPanel.appendChild(password);
  loginPanel.appendChild(emailLabel);
  loginPanel.appendChild(email);
  loginPanel.appendChild(rememberPasswordLabel);
  loginPanel.appendChild(rememberPassword);
  loginPanel.appendChild(projectsLabel);
  loginPanel.appendChild(projects);
  loginPanel.appendChild(loginButton);

  insertBefore(headerBar, loginPanel);
}

function loadData(loginUsername, password, jiraUsername, calendarUsername, projectIds) {
  getDataWithJSON(
    function(response) {
      handleResponse(response, jiraUsername, calendarUsername); //change this when testing
    },
    loginUsername,
    password,
    "https://jira.caplin.com/rest/api/latest/search?jql=updatedDate > -10d AND (" +
      projectIds
        .map(function(e) {
          return "project = " + e;
        })
        .join(" OR ") +
      ") &maxResults=1000&expand=changelog"
  );
}

function getDays() {
  var columns = document
    .getElementById("timesheettable")
    .children[0].children[1].querySelectorAll(".no-sort");
  var dayColumns = [];
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].querySelector(".date-wrapper")) {
      dayColumns.push(columns[i].querySelector(".date-wrapper"));
    }
  }

  var days = [];
  for (let j = 0; j < dayColumns.length; j++) {
    var year = parseInt(dayColumns[j].children[0].innerText) + 2000;
    var month = months[dayColumns[j].children[1].innerText];
    var date = parseInt(dayColumns[j].children[2].innerText);
    days.push(new Date(year, month, date));
  }
  return days;
}

function getDaysMap(startingValue) {
  return getDays().reduce(function(map, obj) {
    map.set(obj,typeof startingValue == "function" ? new startingValue() : startingValue)
    return map;
  }, new Map());
}

function getAllData(data, days) {
  var converter = new DataConverter();
  var dayData = [];
  for (let i = 0; i < 5; i++) {
    var day = days[i];
    dayData.push(converter.processDataForDay(data, day));
  }
  return dayData;
}

function checkRowExistsForAllCode(codes) {
  var rowNum = document.getElementById("timesheettable").children.length;
  var allCodesAdded = [];
  for (let i = 0; i < rowNum; i++) {
    var row = getRowInfo(i);
    if (row) {
      allCodesAdded.push(row.phase + " " + row.client + " - " + row.project + "-" + row.stage);
    }
  }
  Array.from(codes).forEach(function(code) {
    if (allCodesAdded.includes(code)) {

    } else {
      console.log("This code is missing:", code)
      alert(("The following code is missing, check console: " + code))
    }
  })
}


function setAllData2(weekData) {
  var rowNum = document.getElementById("timesheettable").children.length;
  for (let i = 0; i < rowNum; i++) {
    var row = getRowInfo(i);
    if (row) {
      var code =
        row.phase + " " + row.client + " - " + row.project + "-" + row.stage;
      var timeData = [0,0,0,0,0,0,0];
      weekData.forEach((codeMap, day) => {
        if (codeMap.get(code)) {
          timeData[day.getDay()-1] = codeMap.get(code)
        }
      })
      console.log(timeData);
      setRowData(i, timeData);
    }
  }
}

function setAllData(data) {
  var rowNum = document.getElementById("timesheettable").children.length;
  for (let i = 0; i < rowNum; i++) {
    var row = getRowInfo(i);
    if (row) {
      var code =
        row.phase + " " + row.client + " - " + row.project + "-" + row.stage;
      var timeData = [];
      for (let j = 0; j < data.length; j++) {
        if (data[j].get(code)) {
          timeData[j] = data[j].get(code).reduce((a,b) => a + b.hours, 0);
          data[j].get(code).map(function(e) {
            addCardFromData(i, e.jira.id, e.jira.summary, (Math.round((e.hours) * 100) / 100), e.startTime+"-"+e.endTime, "statusTBD", i, j)
          })
        }
      }
      setRowData(i, timeData);
    }
  }
}

function hoursBetweenTwoDates(firstDate, secondDate) {
  return firstDate ? (secondDate - firstDate) / 3600000 : 1.0
}

function setDaySummary(calendar) {
  var summaries = calendar.getEvents().filter((event) => {
    return (event.extendedProps.type == "summary")
  })
  var jirasCalendars = calendar.getEvents().filter((event) => {
    return (event.extendedProps.type == "jira" || event.extendedProps.type == "calendar")
  })
  summaries.forEach((summary) => {
    var events = jirasCalendars.filter((event) => 
      event.extendedProps.day == summary.extendedProps.day && event.extendedProps.hasCode && !event.extendedProps.ignore)
      summary.setProp("title", events.map((event) => hoursBetweenTwoDates(event.start, event.end)).reduce((a,b) => a+b, 0) + " hrs")
  })
}

function addCardFromData(rowId, jiraId, jiraSummary, timeElapsed, duration, status, rowId, dayOfWeekNum) {
  addCardsToRow(
    rowId,
    getCardDiv(
      jiraId,
      jiraSummary,
      timeElapsed + "hrs",
      duration,
      status,
      function() {
        addCellData(rowId, dayOfWeekNum, 0-timeElapsed);
    }
    )
  );
}

function createCalendar(dayData, fullcalendarEvents) {
  dayData.forEach((day, dayId) => {
    day.forEach((issues, codeId) => {
      issues.forEach((issue) => {
        var today = getDays()[dayId];
        var minDate = new Date(today.getTime() + 9*1000*60*60);
        var startTime = roundTimeQuarterHour(new Date(Math.max(minDate, issue.startTime)))
        var maxDate = new Date(today.getTime() + 17.5*1000*60*60);
        var endTime = roundTimeQuarterHour(new Date(Math.min(maxDate, issue.endTime)))
        fullcalendarEvents.push({
          title: issue.jira.id + ": " + issue.jira.summary,
          start: startTime.toISOString(),
          day: startTime.toISOString().substr(0,10),
          end: endTime.toISOString(),
          hasCode: !!codeId,
          code: codeId,
          ignore: false,
          backgroundColor: !!codeId ? "green" : "lightgreen",
          defaultColor: !!codeId ? "green" : "lightgreen",
          type: "jira"
        });
      })
    })
  })
  
  var calendarDiv = document.createElement("div");
  calendarDiv.id = 'calendar';
  calendarDiv.style = "z-index: 300; background-color: white; position: absolute; height: 100%;"
  document.getElementById('maindetail').appendChild(calendarDiv);

  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'list' ],
    customButtons: {
      exportButton: {
        text: 'Export!',
        click: function() {
          var daysMap = getDaysMap(Map);
          daysMap.forEach((map, date) => {
            var events = calendar.getEvents().filter((event) => 
                          event.extendedProps.hasCode && 
                          !event.extendedProps.ignore &&
                          new Date(date.getTime() + 2 * 3600000).toISOString().substr(0,10) == event.start.toISOString().substr(0,10)); //lol this hack is hilarous
            events.forEach((event) => {
              map.set(event.extendedProps.code, map.get(event.extendedProps.code) || 0);
              map.set(event.extendedProps.code, map.get(event.extendedProps.code) + hoursBetweenTwoDates(event.start, event.end))
            })
          })
          setAllData2(daysMap);
        }.bind(this)
      }
    },
    header: {
      left: '',
      // left: '',
      center: 'title',
      // right: 'timeGridWeek'
      right: 'exportButton'
    },
    defaultView: 'timeGridWeek',
    defaultDate: new Date(getDays()[0].getTime()+ 7200000).toISOString().substr(0,10),
    snapDuration: '00:15',
    slotDuration: '00:15',
    editable: true,
    firstDay: 1,
    navLinks: true, // can click day/week names to navigate views
    eventLimit: true, // allow "more" link when too many events
    eventRender: function(info) {
      info.el.title = info.event.title;
    },
    eventClick: function(info) {
      if (info.event.backgroundColor == info.event.extendedProps.defaultColor) {
        info.event.setProp("backgroundColor", "red");
        info.event.setExtendedProp("ignore", true);
      } else {
        info.event.setProp("backgroundColor", info.event.extendedProps.defaultColor);
        info.event.setExtendedProp("ignore", false);
      }
      setTimeout(function() {
        setDaySummary(this);
      }.bind(this),0);
    },
    eventResizeStop: function() {
      setTimeout(function() {
        setDaySummary(this);
      }.bind(this),0);
    },
    eventDragStop: function() {
      setTimeout(function() {
        setDaySummary(this);
      }.bind(this),0);
    },
    events: fullcalendarEvents
  });
  window.calendar = calendar;

  calendar.render();
  alert('Scroll to bottom');

  getDays().forEach((day) => {
    calendar.addEvent({
      title: "0 hrs",
      start: day.toISOString().substr(0,10),
      day: day.toISOString().substr(0,10),
      type: "summary"
    })
  })
  setDaySummary(calendar)
}

function handleResponse(response, user, calendarUsername) {
  var extrator = new DataExtractor(new Date());
  window.sameDay = function(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  window.last10days = Array.from({ length: 10 }, (v, k) => k).map(function(v) {
    var date = new Date();
    date.setDate(date.getDate() - v);
    return { date, events: {} };
  });

  var data = JSON.parse(response.target.response);
  var yourData = data.issues.filter(function(issue) {
    for (var j = 0; j < issue.changelog.histories.length; j++) {
      var change = issue.changelog.histories[j];
      for (var i = 0; i < change.items.length; i++) {
        if (change.items[i].field == "assignee") {
          if (change.items[i].from == user) return true;
          if (change.items[i].to == user) return true;
        }
      }
    }
    return false;
  });

  var extractedData = extrator.extractData(yourData, user);
  var days = getDays();
  var dayData = getAllData(extractedData, days);
  var uniqueCodes = dayData.reduce((a,b) => a.concat(a.concat([...b.keys()])), []).reduce(function(set, obj) {
    set.add(obj)
    return set;
  }, new Set());
  uniqueCodes.delete(null);
  // checkRowExistsForAllCode(uniqueCodes);

  var jirasWithoutCodes = dayData.reduce((a,b) => a.concat(b.get(null) || []), []).reduce((a,b) => a.concat(b.jira.id),[]).reduce(function(set, obj) {
    set.add(obj)
    return set;
  }, new Set());
  if (jirasWithoutCodes.size > 0) {
    console.log("The following Jiras have no codes", jirasWithoutCodes);
    alert(jirasWithoutCodes.size + " Jiras don't have associated timesheet codes. Check console and discuss with your PO or PM");
  }

  var request = new XMLHttpRequest();
  var days = getDays();
  // request.open('GET', 'http://localhost:3000?user=' + calendarUsername + '&startTime=' + new Date(getDays()[0].getTime()+ 7200000).toISOString().substr(0,10) + 'T00:00:00.000Z&endTime=' + new Date(getDays()[6].getTime()+ 7200000).toISOString().substr(0,10) + 'T23:00:00.898Z', true)
  // request.onload = function (response) {
  //   var events = JSON.parse(response.target.response)
  //   var fullcalendarEvents = events.map((event) => {
  //     var code = event.timesheetCode == "No Code" ? null : event.timesheetCode;
  //     return {
  //       title: event.summary,
  //       start: event.startTime,
  //       day: event.startTime.substr(0,10),
  //       end: event.endTime,
  //       backgroundColor: !!code ? "blue" : "lightblue",
  //       defaultColor: !!code ? "blue" : "lightblue",
  //       hasCode: !!code,
  //       code: code,
  //       ignore: false,
  //       type: "calendar"
  //     }
  //   })
  //   //createCalendar();
    
  // }

  // request.send()

  // setAllData(dayData);

  createCalendar(dayData, []);

  console.log("Total issues worked on in last 10 days:", data.issues.length);
  console.log("Issues you have worked on in last 10 days:", yourData.length);

  window.days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
}

getDataWithJSON = function(callback, username, password, requestUrl) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + requestUrl);
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
  };
};

setAuthorizationHeader = function(xhr, username, password) {
  var authHeader = "Basic " + btoa(username + ":" + password);
  xhr.setRequestHeader("Authorization", authHeader);
};

// addClickEventsToDate();
addLoginPanel();

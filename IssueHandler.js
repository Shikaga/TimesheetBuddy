define(['StatCalculator'], function(StatCalculator) {
  function IssueHandler() {
    this.issues = [];
  }

  IssueHandler.prototype.addIssue = function(issue) {
    this.issues.push(issue);
  }

  IssueHandler.prototype.getIssue = function(issueId) {
    for (var i=0; i < this.issues.length; i++) {
      var issue = this.issues[i];
      if (issue.id.match(/\d+/)[0] === issueId) {
        return issue;
      }
    }
    return null;
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
        //var data = JSON.parse(response.target.response);
        console.log(response);
        callback(response);

      }
    }
  };

  setAuthorizationHeader = function(xhr, username, password) {
    var authHeader = "Basic "+btoa(username + ":" + password);
    xhr.setRequestHeader("Authorization", authHeader);
  }

  if (window.localStorage.getItem("jiraData")) {
    statisticsCalculator = new StatCalculator(JSON.parse(window.localStorage.getItem("jiraData")).issues);
  }

  return IssueHandler;
});

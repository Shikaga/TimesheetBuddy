define(['lib/react', 'LoginPanel', 'TimelinePanel', 'StatCalculator'], function(React, LoginPanel, TimelinePanel,StatCalculator) {
  var JiraStatisticsCompilerPanel = React.createClass({
    render: function() {
      return React.DOM.div({className: "container"}, LoginPanel({login: this.login}), TimelinePanel({jiraId: this.props.jiraId, events: this.props.events}));
    },
    getInitialState: function() {
      return {
      }
    },
    selectProject: function(projectIds, user) {
        getDataWithJSON(function(response) {
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
          issue.changelog.histories.map(function(change) {
            change.items.map(function(fieldChanged) {
              if (fieldChanged.field=="assignee") {
                for (var i=0; i < window.last10days.length; i++) {
                  if (window.sameDay(window.last10days[i].date, new Date(Date.parse(change.created)))) {
                    
                    window.last10days[i].events[issue.key+" "+issue.fields.customfield_11670] = window.last10days[i].events[issue.key+" "+issue.fields.customfield_11670] || [];
                    window.last10days[i].events[issue.key+" "+issue.fields.customfield_11670].push({
                      toString: function() {return  this.event + " - " + this.time.getHours() + ":" + this.time.getMinutes()},
                      event: fieldChanged.from + " -> " + fieldChanged.to,
                      time: new Date(Date.parse(change.created))
                    })
                  }
                }
                
              }
              if (fieldChanged.field=="status") {
                for (var i=0; i < window.last10days.length; i++) {
                  if (window.sameDay(window.last10days[i].date, new Date(Date.parse(change.created)))) {
                    window.last10days[i].events[issue.key+" "+issue.fields.customfield_11670] = window.last10days[i].events[issue.key+" "+issue.fields.customfield_11670] || [];
                    window.last10days[i].events[issue.key+" "+issue.fields.customfield_11670].push({
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
                console.log("  ", event.toString());
              })
              
            });
          })
      }, this.state.username, this.state.password,
      this.state.url + "/rest/api/latest/search?jql=" + "updatedDate > -10d AND (" + projectIds.map(function(e) {return "project = " + e}).join(" OR ") + ") &maxResults=1000&expand=changelog");
    },
    login: function(url, username, password, projects, user) {
        window.url = url;
        this.state.url = url;
        this.state.username = username;
        this.state.password = password;
        this.setState({
          url: url,
          username: username,
          password: password,
          mode: "loggedIn"
        });
        this.selectProject(projects, user);
      }
  });

  return JiraStatisticsCompilerPanel;
});

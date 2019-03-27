define(['lib/react', 'LoginPanel', 'TimelinePanel', 'StatCalculator'], function(React, LoginPanel, TimelinePanel,StatCalculator) {
  var JiraStatisticsCompilerPanel = React.createClass({
    render: function() {
      return React.DOM.div({className: "container"}, LoginPanel({login: this.login}), TimelinePanel({jiraId: this.props.jiraId, events: this.props.events}));
    },
    getInitialState: function() {
      return {
      }
    },
    selectProject: function(projectId) {
        getDataWithJSON(function(response) {
                window.localStorage.setItem("jiraData", response.target.response);
                statisticsCalculator = new StatCalculator(JSON.parse(window.localStorage.getItem("jiraData")).issues);
                alert("Issue Data loaded, please wait for the comments.")
            }, this.state.username, this.state.password,
            this.state.url + "/rest/api/latest/search?jql=issue=" + window.location.search.substr(1) + "&maxResults=1000&expand=changelog");
        getDataWithJSON(function(response) {
                window.localStorage.setItem("comments", response.target.response);
                alert("Comments loaded. Please restart the app to see the timeline")
            }, this.state.username, this.state.password,
            this.state.url + "/rest/api/latest/issue/" + window.location.search.substr(1) + "/comment");
    },
    login: function(url, username, password) {
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
        this.selectProject(80);
      }
  });

  return JiraStatisticsCompilerPanel;
});

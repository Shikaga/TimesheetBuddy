define(['lib/react'], function(React) {
  var LoginPanel = React.createClass({
    getInitialState: function() {
      return {
        url: "https://jira.caplin.com",
        username: "jonp",
        password: "",
        projects: "FXM,MFXMOTIF,FXST,PCTLIBRARY,CT5UP,PTGUI",
        user: "tobiast"
      }
    },
    changeUrl: function(e) {
      this.setState({
        url: e.target.value
      });
    },
    changeUsername: function(e) {
      this.setState({
        username: e.target.value
      });
    },
    changePassword: function(e) {
      this.setState({
        password: e.target.value
      });
    },
    changeProject: function(e) {
      this.setState({
        projects: e.target.value
      });
    },
    changeUser: function(e) {
      this.setState({
        user: e.target.value
      });
    },
    handleKeyPress: function(e,f,g) {
      if (e.which == 13) {
        this.login();
      }
    },
    login: function() {
      this.props.login(this.state.url, this.state.username, this.state.password, this.state.projects.split(","), this.state.user);
    },
    render: function() {
      return React.DOM.div({className: "panel panel-default"},
        React.DOM.div({className: "panel-body"},
          React.DOM.div({className: "input-group"},
            React.DOM.span({className: "input-group-addon"}, "Jira URL"),
            React.DOM.input({type: "text", onChange: this.changeUrl, value: this.state.url, className: "form-control"})
          ),
          React.DOM.br(),
          React.DOM.div({className: "input-group"},
            React.DOM.span({className: "input-group-addon"}, "Username"),
            React.DOM.input({type: "text", onChange: this.changeUsername, value: this.state.username, className: "form-control"})
          ),
          React.DOM.br(),
          React.DOM.div({className: "input-group"},
            React.DOM.span({className: "input-group-addon"}, "Password"),
            React.DOM.input({type: "password", onKeyUp: this.handleKeyPress, onChange: this.changePassword, value: this.state.password, className: "form-control"})
          ),
          React.DOM.br(),
          React.DOM.div({className: "input-group"},
            React.DOM.span({className: "input-group-addon"}, "Projects"),
            React.DOM.input({type: "text", onKeyUp: this.handleKeyPress, onChange: this.changeProject, value: this.state.projects, className: "form-control"})
          ),
          React.DOM.br(),
          React.DOM.div({className: "input-group"},
            React.DOM.span({className: "input-group-addon"}, "User"),
            React.DOM.input({type: "text", onKeyUp: this.handleKeyPress, onChange: this.changeUser, value: this.state.user, className: "form-control"})
          ),
          React.DOM.div({className: "panel-body"},
            React.DOM.div({className: "col-xs-12 col-md-12"},
              React.DOM.button({type: "button", onClick: this.login, className: "btn btn-success btn-block"}, "Login")
            )
          )
        )
      );
    }
  });

  return LoginPanel;
});

define(['lib/react'], function(React) {
	var TimelinePanel = React.createClass({
		getInitialState: function() {
			return {
			}
		},
		render: function() {

			function getEventClassName(event) {
				if (event.date.getDay() === 6 || event.date.getDay() === 0) {
					return {className: "danger"};
				} else {
					return {};
				}
			}

			var dateCells = [];
			var maxStatuses = this.props.events.map(function(e) {return e.statusChanges ? e.statusChanges.length : 0}).reduce(function(left, right) {return Math.max(left, right)}, 0);
			var maxComments = this.props.events.map(function(e) {return e.comments ? e.comments.length : 0}).reduce(function(left, right) {return Math.max(left, right)}, 0);
			var statusRows = [];
			var commentRows = [];
			for (var i=0; i < maxStatuses; i++) {
				var cells = [];
				for (var j=0; j < this.props.events.length; j++) {
					cells.push(React.DOM.td(getEventClassName(this.props.events[j]), ""));
				}
				statusRows.push(React.DOM.tr({},cells));
			}
			for (var i=0; i < maxComments; i++) {
				var cells = [];
				for (var j=0; j < this.props.events.length; j++) {
					cells.push(React.DOM.td(getEventClassName(this.props.events[j]), ""));
				}
				commentRows.push(React.DOM.tr({},cells));
			}
			this.props.events.forEach(function(event, index) {
				dateCells.push(React.DOM.td({}, event.date.getDate()+"/"+(event.date.getMonth()+1)+"/"+(event.date.getYear()+1900)));
				// debugger;
				event.statusChanges.forEach(function(status, statusIndex) {
					statusRows[statusIndex].props.children[index] = React.DOM.td(getEventClassName(event), status);
				})
				event.comments.forEach(function(comment, commentIndex) {
					commentRows[commentIndex].props.children[index] = React.DOM.td(getEventClassName(event), comment);
				})
			});
			return React.DOM.table({className: "table"},
				React.DOM.h1({}, this.props.jiraId),
				React.DOM.tr({},dateCells),
				statusRows,
				commentRows
			);
		}
	});


	return TimelinePanel;
});

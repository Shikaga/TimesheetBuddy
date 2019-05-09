import { trackedStatuses } from "./statuses";

export default class DataExtractor {
  constructor() {}

  getUserData(responseData, user) {
    return responseData.issues.filter(function(issue) {
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
  }

  extractData(data, user) {
    // const userData = this.getUserData(data, user);
    return data.map(jira => {
      return this.processJira(jira, user);
    });
  }

  getInitialField(histories, fieldName) {
    for (let i = 0; i < histories.length; i++) {
      const items = histories[i].items;

      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if (item.field === fieldName) {
          return item.from;
        }
      }
    }
  }

  addRowGeneralChecks(
    user,
    currentAssignee,
    currentStatus,
    latestStartTime,
    newStart
  ) {
    if (currentAssignee != user) {
      return false;
    }

    if (!trackedStatuses.includes(currentStatus)) {
      return false;
    }
    const timeInMinutesForEvent = (newStart - latestStartTime) / 60000;

    if (timeInMinutesForEvent <= 5) {
      return false;
    }

    return true;
  }

  addRowNewAssignee(
    rows,
    user,
    currentAssignee,
    currentAssigneeStart,
    currentStatus,
    currentStatusStart,
    newAssignee,
    newAssigneeStart
  ) {
    const latestStartTime =
      currentAssigneeStart - currentStatusStart > 0
        ? currentAssigneeStart
        : currentStatusStart;

    if (
      !this.addRowGeneralChecks(
        user,
        currentAssignee,
        currentStatus,
        latestStartTime,
        newAssigneeStart
      )
    ) {
      return;
    }

    if (newAssignee == user) {
      return;
    }

    rows.push({
      status: currentStatus,
      startTime: latestStartTime,
      endTime: newAssigneeStart
    });
  }

  addRowNewStatus(
    rows,
    user,
    currentAssignee,
    currentAssigneeStart,
    currentStatus,
    currentStatusStart,
    newStatus,
    newStatusStart
  ) {
    const latestStartTime =
      currentAssigneeStart - currentStatusStart > 0
        ? currentAssigneeStart
        : currentStatusStart;

    if (
      !this.addRowGeneralChecks(
        user,
        currentAssignee,
        currentStatus,
        latestStartTime,
        newStatusStart
      )
    ) {
      return;
    }

    if (currentStatus == newStatus) {
      return;
    }

    rows.push({
      status: currentStatus,
      startTime: latestStartTime,
      endTime: newStatusStart
    });
  }

  processJira(jira, user) {
    const histories = jira.changelog.histories;
    let currentStatus = this.getInitialField(histories, "status");
    let currentStatusStart = new Date(histories[0].created);
    let currentAssignee = this.getInitialField(histories, "assignee");
    let currentAssigneeStart = new Date(histories[0].created);

    let newStatus, newStatusStart, newAssignee, newAssigneeStart;

    const jiraSum = {
      timesheetCode: jira.fields.customfield_11670,
      summary: jira.fields.summary
    };
    const rows = [];

    for (let i = 0; i < histories.length; i++) {
      const items = histories[i].items;

      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        switch (items[j].field) {
          case "status":
            newStatusStart = new Date(histories[i].created);
            newStatus = item.toString;
            this.addRowNewStatus(
              rows,
              user,
              currentAssignee,
              currentAssigneeStart,
              currentStatus,
              currentStatusStart,
              newStatus,
              newStatusStart
            );
            currentStatusStart = newStatusStart;
            currentStatus = newStatus;
            break;
          case "assignee":
            newAssignee = item.to;
            newAssigneeStart = new Date(histories[i].created);
            this.addRowNewAssignee(
              rows,
              user,
              currentAssignee,
              currentAssigneeStart,
              currentStatus,
              currentStatusStart,
              newAssignee,
              newAssigneeStart
            );
            currentAssignee = newAssignee;
            currentAssigneeStart = newAssigneeStart;
            break;
        }
      }
    }
    return rows.map(row => {
      return {
        ...row,
        jira: jiraSum
      };
    });
  }
}

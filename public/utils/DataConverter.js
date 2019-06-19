class DataConverter {
  constructor() {}

  processDataForDay(data, day) {
    const hoursForCodes = new Map();

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const row = data[i][j];
        const hours = this.hoursOnDay(day, row.startTime, row.endTime);
        const code = row.jira.timesheetCode;
        if (hours > 0.08) {
          if (!hoursForCodes.get(code)) {
            hoursForCodes.set(code, []);
          }
          hoursForCodes.get(code).push({hours, jira:row.jira, startTime: row.startTime, endTime: row.endTime});
        }
      }
    }

    return hoursForCodes;
  }

  hoursOnDay(day, startTime, endTime) {
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const nineOclock = day.getTime() + 9 * 60 * 60 * 1000;
    const five30 = day.getTime() + 17.5 * 60 * 60 * 1000;
    let end = endTime.getTime();
    let start = startTime.getTime();

    if (day >= endTime) {
      return 0;
    }
    if (day.getTime() + oneDay <= startTime.getTime()) {
      return 0;
    }

    if (nineOclock > start) {
      start = nineOclock;
    }

    if (five30 < end) {
      end = five30;
    }

    return (end - start) / oneHour;
  }
}

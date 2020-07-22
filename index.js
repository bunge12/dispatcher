const util = require("util");

const initialize = () => {
  let calendar = [];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (let i = 1; i < 53; i++) {
    let weekdays = [];
    days.forEach((element, i) => {
      let hours = [];
      for (let i = 0; i < 25; i++) {
        hours.push({ id: i, task: [] });
      }
      weekdays.push({ id: i + 1, name: element, schedule: hours });
    });
    calendar.push({ id: i, name: `Week ${i}`, days: weekdays });
    // console.log(weekdays);
  }
  console.log(util.inspect(calendar, false, null, true /* enable colors */));
};

initialize();

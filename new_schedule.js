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
      for (let i = 0; i < 24; i++) {
        hours.push({ id: i, task: [] });
      }
      weekdays.push({ id: i + 1, name: element, schedule: hours });
    });
    calendar.push({ id: i, name: `Week ${i}`, weekdays });
  }
  // let fullCalendar = [calendar, calendar, calendar];
  // console.log(JSON.stringify(calendar));
  return calendar;
};

const list0 = initialize();
const list1 = initialize();
const list2 = initialize();

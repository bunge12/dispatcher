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
  return calendar;
};

const list0 = initialize();
const list1 = initialize();
const list2 = initialize();

list0[0].weekdays[0].schedule[0].task = {
  job: "Pickup",
  details: "products from 1st",
  location: "Toronto",
};
list0[0].weekdays[3].schedule[7].task = {
  job: "Dropoff",
  details: "hazardous materials",
  location: "Toronto",
};
list0[0].weekdays[3].schedule[8].task = {
  job: "Dropoff",
  details: "hazardous materials",
  location: "Toronto",
};
list1[0].weekdays[4].schedule[15].task = {
  job: "Pickup",
  details: "products from 2nd",
  location: "Toronto",
};
list2[0].weekdays[2].schedule[12].task = {
  job: "Pickup",
  details: "products from 3rd",
  location: "Toronto",
};

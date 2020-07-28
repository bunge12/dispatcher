let person = 0;
const people = ["Giorgio Sinclair", "Libbie Walton", "Aysha Fountain"];
let schedule = list[0];

// Deletes selected record
const deleteEvent = (eventDetails) => {
  const { week, day, hour, length } = eventDetails;
  for (let i = 0; i <= length; i++) {
    schedule[week].weekdays[day].schedule[parseInt(hour) + i].task = [];
  }
};

// Saves an event
const saveEvent = (eventDetails) => {
  const { task, details, location, length, week, day, hour } = eventDetails;
  let correctedLength = parseInt(length) + 1;
  for (let i = 0; i < correctedLength; i++) {
    schedule[parseInt(week.trim())].weekdays[parseInt(day.trim())].schedule[
      parseInt(hour) + i
    ].task = {
      job: task,
      details: details.replace(/%20/g, " "),
      location: location,
    };
  }
};

// Cleans up text from a form
const cleanup = (text) => {
  return text.split("=")[1].trim();
};

// Generate calendar
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
    calendar.push({ id: i, name: `Week ${i}`, days: weekdays });
    // console.log(weekdays);
  }
  console.log(util.inspect(calendar, false, null, true /* enable colors */));
  return calendar;
};

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

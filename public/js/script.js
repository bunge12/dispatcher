// Initial Settings
let person = 0;
const people = ["Giorgio Sinclair", "Libbie Walton", "Aysha Fountain"];
let schedule;
person === 0
  ? (schedule = list0)
  : person === 1
  ? (schedule = list1)
  : (schedule = list2);

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
      details: decodeURIComponent(details),
      location: decodeURIComponent(location),
    };
  }
};

// Cleans up text from a form
const cleanup = (text) => {
  return text.split("=")[1].trim();
};

// Downloads a report with day-by-day breakdown of assignments
const downloadReport = (schedule) => {
  let dayResults = [];
  let start = 1;
  schedule.forEach((week) => {
    week.weekdays.forEach((day) => {
      let pickup = 0,
        dropoff = 0;
      other = 0;
      let trackTask = "",
        trackDetail = "";
      day.schedule.forEach((hour) => {
        if (!Array.isArray(hour.task)) {
          if (trackTask === "" && trackDetail === "") {
            trackTask = hour.task.job;
            trackDetail = hour.task.details;
          }
          if (trackTask != hour.task.job || trackDetail != hour.task.details) {
            trackTask === "Pickup"
              ? pickup++
              : trackTask === "Dropoff"
              ? dropoff++
              : other++;
            trackTask = hour.task.job;
            trackDetail = hour.task.details;
          }
        } else {
          trackTask === "Pickup"
            ? pickup++
            : trackTask === "Dropoff"
            ? dropoff++
            : trackTask === "Other"
            ? other++
            : "";
          trackTask = "";
          trackDetail = "";
        }
      });
      dayResults.push([start, pickup, dropoff, other]);
      start++;
    });
  });
  return dayResults;
};

// Merges the report based on the step provided
const processReport = (data, step) => {
  console.log(data.length);
  let report = [];
  for (let i = 0; i <= data.length; i += step) {
    let pickup = 0,
      dropoff = 0,
      other = 0;
    let next = i + step;
    for (let y = i; y < next; y++) {
      if (data[y]) {
        pickup += data[y][1];
        dropoff += data[y][2];
        other += data[y][3];
      }
    }
    report.push([`Day ${i + 1} - Day ${i + step + 1}`, pickup, dropoff, other]);
  }
  return report;
};

// Merges report into a CSV and downloads it
const reporting = (schedule, step) => {
  const rows = processReport(downloadReport(schedule), step);
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Time-Frame,Pickup,Dropoff,Other\r\n";
  rows.forEach((rowArray) => {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `report_as_of_${new Date()}.csv`);
  document.body.appendChild(link);
  link.click();
};

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
      details: details.replace(/%20/g, " "),
      location: location,
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
  console.log(dayResults);
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
    report.push(
      `Day ${i + 1} - ${i + step + 1}, ${pickup}, ${dropoff}, ${other}`
    );
  }
  // console.log(report);
  return report;
};

const reporting = () => {
  const rows = [
    ["name1", "city1", "some other info"],
    ["name2", "city2", "more info"],
  ];

  let csvContent = "data:text/csv;charset=utf-8,";

  rows.forEach((rowArray) => {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_data.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
};

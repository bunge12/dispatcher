$(document).ready(function () {
  // Initial Settings
  let start = 0;
  $(".week_num").text(start + 1);

  // Populate new driver dropdown
  $.each(people, function (index, text) {
    $(".dropdown-menu").append(
      $("<a class='dropdown-item' href='#'></a>")
        .attr("data-id", index)
        .html(`${text}`)
    );
  });
  $(".driver-name").text(people[person]);
  $(document.body).on("click", ".dropdown-item", function () {
    person = parseInt($(this).attr("data-id"));
    person === 0
      ? (schedule = list0)
      : person === 1
      ? (schedule = list1)
      : (schedule = list2);
    $(".driver-name").text($(this).text());
    loadData();
  });

  // Sends a 3 second disappearing notification
  const notify = (message, status) => {
    $(".notification").text(message).addClass(`alert alert-${status}`).show();
    setTimeout(() => {
      $(".notification").hide();
    }, 3000);
  };

  // Calculates conflict with other events, exclude conflict with self
  const calculateConflict = (data) => {
    const { length, start, new_day, new_time, task, details } = data;
    for (let i = 0; i <= length; i++) {
      if (
        !Array.isArray(
          schedule[start].weekdays[new_day].schedule[parseInt(new_time) + i]
            .task
        ) &&
        schedule[start].weekdays[new_day].schedule[parseInt(new_time) + i].task
          .job != task &&
        schedule[start].weekdays[new_day].schedule[parseInt(new_time) + i].task
          .details != details
      ) {
        $(".modal-new-notification")
          .text(
            "Warning - this task conflicts with the next scheduled event. Saving this will overwrite the next task."
          )
          .addClass(`alert alert-warning`);
      }
    }
  };

  // Merges neighbouring cells with same task
  const updateRows = () => {
    let i = 0;
    let $trs = $("#records_table tr");
    $trs.each(function () {
      let $tds = $(this).find("td");
      let width = $tds.length;
      let num = 2;
      for (i = width - 2; i >= 0; i--) {
        if (
          $($tds[i]).html() == $($tds[i + 1]).html() &&
          $($tds[i]).html() != ""
        ) {
          $($tds[i]).attr("colspan", num);
          num++;
          $($tds[i + 1]).remove();
        } else {
          num = 2;
        }
      }
      $tds = $(this).find("td");
      width = $tds.length;
      $($tds[0]).attr("seq", 0);
      for (i = 1; i < width; i++) {
        $($tds[i]).attr(
          "seq",
          parseInt($($tds[i - 1]).attr("seq")) + $($tds[i - 1]).prop("colspan")
        );
      }
    });
  };

  // Loads data from schedule file
  const loadData = () => {
    $("#records_table").empty();
    response = schedule[start].weekdays;
    $.each(response, function (i, item) {
      let $tr = $(`<tr id='D${item.id}'>`)
        .append($("<th scope='row'>").text(item.name))
        .appendTo("#records_table");
      $.each(item.schedule, function (i, hour) {
        if (Array.isArray(hour.task)) {
          $($tr).append(
            $(`<td class="timeslot" id='D${item.id}H${hour.id}'>`).text("")
          );
        } else {
          $($tr).append(
            $(
              `<td class="timeslot table-primary" id='D${item.id}H${hour.id}'>`
            ).text(
              `${hour.task.job} ${hour.task.details} (${hour.task.location})`
            )
          );
        }
      });
    });
    updateRows();
  };

  // Next button functionality
  $("#next").click(function () {
    start++;
    $("#prev").removeAttr("disabled");
    if (start + 1 === schedule.length) {
      $(this).attr("disabled", "disabled");
    }
    $(".week_num").text(start + 1);
    loadData();
  });

  // Previous button functionality
  $("#prev").click(function () {
    start--;
    $("#next").removeAttr("disabled");
    $(".week_num").text(start + 1);
    if (start === 0) {
      $(this).attr("disabled", "disabled");
    }
    loadData();
  });

  // Listen to change in "length" drop-down and check if event overlaps
  $(document.body).on("change", "#length", function () {
    $(".modal-new-notification").empty().removeClass("alert alert-warning");
    let length = $(this).val();
    let [week, day, hour] = $(".date_time").val().split(".");
    for (let i = 0; i <= length; i++) {
      if (
        !Array.isArray(
          schedule[week].weekdays[day].schedule[parseInt(hour) + i].task
        )
      ) {
        $(".modal-new-notification")
          .text(
            "Warning - this task conflicts with the next scheduled event. Saving this will overwrite the next task."
          )
          .addClass(`alert alert-warning`);
      }
    }
  });

  // Listen to change in "length" drop-down and check if event overlaps
  $(document.body).on("change", "#length_edit", function () {
    $(".modal-new-notification").empty().removeClass(`alert alert-warning`);
    let length = $(this).val();
    let new_day = $("#new_day").val();
    let new_time = $("#new_time").val();
    let task = $(".task").val();
    let details = $("#details").val();
    calculateConflict({ length, start, new_day, new_time, task, details });
  });

  // Listen to change in "day" and "time" for edited event drop-down, repopulate "length" & calculate conflict
  $(document.body).on("change", "#new_day, #new_time", function () {
    $(".modal-new-notification").empty().removeClass(`alert alert-warning`);
    $("#length_edit").empty();
    let length = $(".original_len").val();
    let new_day = $("#new_day").val();
    let new_time = $("#new_time").val();
    let task = $(".task").val();
    let details = $("#details").val();
    let remain = hours.slice(parseInt(new_time) + 1);
    $.each(remain, function (index, text) {
      $("#length_edit").append(
        $("<option></option>")
          .val(index)
          .html(`${text} (${index + 1} hour)`)
      );
    });
    $(`#length_edit option[value='${length}']`).attr("selected", "selected");
    calculateConflict({ length, start, new_day, new_time, task, details });
  });

  // Listen to clicks on a timeslot, show new/edit form
  $(document.body).on("click", ".timeslot", function () {
    $(".modal-new-notification").empty().removeClass(`alert alert-warning`);
    if ($(this).text() === "") {
      // Show "new task" modal and populate time
      $("#newModal").modal("show");
      let hour = parseInt($(this).attr("id").slice(3));
      let day = $(this).attr("id").slice(1, 2) - 1;
      $(".date_time").val(`${start}.${day}.${hour}`);
      $(".datetime").text(`${days[day]} at ${hours[hour]}`);
      // Populate "length" drop-down
      let remain = hours.slice(hour + 1);
      $("#length").empty();
      $.each(remain, function (index, text) {
        $("#length").append(
          $("<option></option>")
            .val(index)
            .html(`${text} (${index + 1} ${index === 0 ? "hour" : "hours"})`)
        );
      });
    } else {
      // Show "edit" modal, populate time and other fields
      $("#editModal").modal("show");
      $(`.task option`).removeAttr("selected");
      let hour = parseInt($(this).attr("id").slice(3));
      let day = $(this).attr("id").slice(1, 2) - 1;
      $(".date_time_original").val(`${start}.${day}.${hour}`);
      $(".date_time").val(`${start}.${day}.${hour}`);
      $(".datetime").text(`${days[day]} at ${hours[hour]}`);
      $("#details").val(
        schedule[start].weekdays[day].schedule[hour].task.details
      );
      $("#location").val(
        schedule[start].weekdays[day].schedule[hour].task.location
      );
      $("#length_edit").empty();
      $("#new_day").empty();
      $.each(days, function (index, text) {
        $("#new_day").append($("<option></option>").val(index).html(`${text}`));
      });
      $(`#new_day option[value='${day}']`).attr("selected", "selected");
      $("#new_time").empty();
      $.each(hours, function (index, text) {
        $("#new_time").append(
          $("<option></option>").val(index).html(`${text}`)
        );
      });
      $(`#new_time option[value='${hour}']`).attr("selected", "selected");

      let remain = hours.slice(hour + 1);
      $.each(remain, function (index, text) {
        $("#length_edit").append(
          $("<option></option>")
            .val(index)
            .html(`${text} (${index + 1} ${index === 0 ? "hour" : "hours"})`)
        );
      });
      let valueOfColspan = $(this).attr("colspan");
      if (!valueOfColspan) {
        $(".original_len").val(0);
      } else {
        $(".original_len").val($(this).attr("colspan") - 1);
      }
      $(
        `.task option[value='${schedule[start].weekdays[day].schedule[hour].task.job}']`
      ).attr("selected", "selected");
      $(`#length_edit option[value='${$(this).attr("colspan") - 1}']`).attr(
        "selected",
        "selected"
      );
    }
  });

  // Adding an entry
  $(document.body).on("submit", "#add", function () {
    //Receive data, destructure it
    event.preventDefault();
    let form = $(this);
    let data = form.serialize();
    let [task, details, location, length, time] = data.split("&");
    let [week, day, hour] = time.split(".");
    // Save Event
    saveEvent({
      task: cleanup(task),
      details: cleanup(details),
      location: cleanup(location),
      length: cleanup(length),
      week: cleanup(week),
      day: day,
      hour: hour,
    });
    // Clear & reset the form, show feedback
    $("#newModal").modal("hide");
    $("#add").trigger("reset");
    notify("Entry Successfully Added!", "success");
    loadData();
  });

  // Deleting an entry
  $(document.body).on("click", ".delete", function () {
    let form = $("#edit");
    let data = form.serialize();
    let [
      new_day,
      new_time,
      task,
      details,
      location,
      length,
      original_time,
      original_len,
    ] = data.split("&");
    let [week, day, hour] = original_time.split("=")[1].split(".");
    // Delete old record
    deleteEvent({
      week,
      day,
      hour,
      length: parseInt(original_len.split("=")[1]),
    });
    //  Inform User, Reset form and Reload Data
    $("#editModal").modal("hide");
    $("#edit").trigger("reset");
    notify("Entry Successfully Deleted!", "success");
    loadData();
  });

  // Editing an entry
  $(document.body).on("submit", "#edit", function () {
    // Receive and destructure data
    event.preventDefault();
    let form = $(this);
    let data = form.serialize();
    let [
      new_day,
      new_time,
      task,
      details,
      location,
      length,
      original_time,
      original_len,
    ] = data.split("&");
    let [week, day, hour] = original_time.split("=")[1].split(".");
    // Delete old record
    deleteEvent({
      week,
      day,
      hour,
      length: parseInt(original_len.split("=")[1]),
    });
    // Create new record
    saveEvent({
      task: cleanup(task),
      details: cleanup(details),
      location: cleanup(location),
      length: cleanup(length),
      week,
      day: cleanup(new_day),
      hour: cleanup(new_time),
    });
    // Hide & reset form, show feedback, reload data
    $("#editModal").modal("hide");
    $("#edit").trigger("reset");
    notify("Task Edited Successfully!", "success");
    loadData();
  });

  // Pass the step/division selection to the reporting function
  $(document.body).on("click", ".report", function () {
    event.preventDefault();
    const step = parseInt($("#division").val());
    reporting(schedule, step);
  });

  // Listen to dark mode changes
  $(document.body).on("change", "#darkMode", function () {
    if (this.checked) {
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      DarkReader.disable();
    }
  });

  // Make a call to Google Maps
  const callGmaps = (event) => {
    $(".autocomplete-items").empty();
    let val = $(".gmaps").val();
    val === "" ? (val = $("#location").val()) : "";
    $.ajax({
      type: "POST",
      url: "/maps",
      data: { query: val },
      success: function (msg) {
        $.each(msg, function (index, text) {
          $(".autocomplete-items").append(
            $("<div class='suggestion'></div>").html(`${text}`)
          );
        });
      },
    });
  };

  // Populate location with selected suggestion
  $(document.body).on("click", ".suggestion", function () {
    $(".gmaps").val($(this).text());
    $(".autocomplete-items").empty();
  });

  // Bind debounce to gmaps and listen to keyup
  $(".gmaps").keyup($.debounce(250, callGmaps));

  $("#newModal, #editModal").on("hidden.bs.modal", function (e) {
    $(".autocomplete-items").empty();
    $("#add").trigger("reset");
    $("#edit").trigger("reset");
    $("#deleteConfirm").collapse("hide");
  });

  loadData();
});

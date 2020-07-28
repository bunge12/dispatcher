$(document).ready(function () {
  // Initial Settings
  let start = 0;
  $(".week_num").text(start + 1);

  $.each(people, function (index, text) {
    $("#driver").append($("<option></option>").val(index).html(`${text}`));
  });
  $(`#driver option[value='${person}']`).attr("selected", "selected");
  $(document.body).on("change", "#driver", function () {
    person = parseInt($(this).val());
    person === 0
      ? (schedule = list0)
      : person === 1
      ? (schedule = list1)
      : (schedule = list2);
    loadData();
  });

  const updateRows = () => {
    var i = 0;
    var $trs = $("#records_table tr");
    $trs.each(function () {
      var $tds = $(this).find("td");
      var width = $tds.length;
      var num = 2;
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

  const loadData = () => {
    $("#records_table").empty();
    response = schedule[start].weekdays;
    $.each(response, function (i, item) {
      let $tr = $(`<tr id='D${item.id}'>`)
        .append($("<td>").text(item.name))
        .appendTo("#records_table");
      $.each(item.schedule, function (i, hour) {
        if (Array.isArray(hour.task)) {
          $($tr).append(
            $(`<td class="timeslot" id='D${item.id}H${hour.id}'>`).text("")
          );
        } else {
          $($tr).append(
            $(`<td class="timeslot" id='D${item.id}H${hour.id}'>`).text(
              `${hour.task.job} ${hour.task.details}`
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
    $(".new_form").css("display", "none");
    $(".update_form").css("display", "none");
    $(".notification").empty();
    $("#add").each(function () {
      this.reset();
    });
    $("#edit").each(function () {
      this.reset();
    });
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
    $(".new_form").css("display", "none");
    $(".update_form").css("display", "none");
    $(".notification").empty();
    $("#add").each(function () {
      this.reset();
    });
    $("#edit").each(function () {
      this.reset();
    });
    loadData();
  });

  // Listen to change in "length" drop-down and check if event overlaps
  $(document.body).on("change", "#length", function () {
    $(".notification").empty();
    let length = $(this).val();
    let [week, day, hour] = $(".date_time").val().split(".");
    console.log(week, day, hour, length);
    for (let i = 0; i <= length; i++) {
      if (
        !Array.isArray(
          schedule[week].weekdays[day].schedule[parseInt(hour) + i].task
        )
      ) {
        $(".notification").text("Alert - events clash. ");
      }
    }
  });

  // Listen to change in "length" drop-down and check if event overlaps
  $(document.body).on("change", "#length_edit", function () {
    $(".notification").empty();
    let length = $(this).val();
    let new_day = $("#new_day").val();
    let new_time = $("#new_time").val();
    console.log(new_day, new_time, length);
    for (let i = 0; i <= length; i++) {
      if (
        !Array.isArray(
          schedule[start].weekdays[new_day].schedule[parseInt(new_time) + i]
            .task
        )
      ) {
        $(".notification").text("Alert - events clash. ");
      }
    }
  });

  // Listen to change in "time" for edited event drop-down, repopulate "length" & calculate conflict
  $(document.body).on("change", "#new_time", function () {
    $("#length_edit").empty();
    let remain = hours.slice(parseInt($(this).val()) + 1);
    $.each(remain, function (index, text) {
      $("#length_edit").append(
        $("<option></option>")
          .val(index)
          .html(`${text} (${index + 1} hour)`)
      );
    });
    $(`#length_edit option[value='${$(".original_len").val()}']`).attr(
      "selected",
      "selected"
    );
    let length = $(this).val();
    let new_day = $("#new_day").val();
    let new_time = $("#new_time").val();
    console.log(new_day, new_time, length);
    for (let i = 0; i <= length; i++) {
      if (
        !Array.isArray(
          schedule[start].weekdays[new_day].schedule[parseInt(new_time) + i]
            .task
        )
      ) {
        $(".notification").text("Alert - events clash. ");
      }
    }
  });

  // Listen to clicks on a timeslot, show new/edit form
  $(document.body).on("click", ".timeslot", function () {
    $(".notification").empty();
    if ($(this).text() === "") {
      let hour = parseInt($(this).attr("id").slice(3));
      let day = $(this).attr("id").slice(1, 2) - 1;
      $(".new_form").css("display", "");
      $(".update_form").css("display", "none");
      $(".date_time").val(`${start}.${day}.${hour}`);
      $(".datetime").text(`${days[day]} at ${hours[hour]}`);
      $("#length").empty();
      let remain = hours.slice(hour + 1);
      $.each(remain, function (index, text) {
        $("#length").append(
          $("<option></option>")
            .val(index)
            .html(`${text} (${index + 1} hour)`)
        );
      });
    } else {
      console.log("editing" + $(this).text(), $(this).attr("id"));
      $(`#task option`).removeAttr("selected");
      let hour = parseInt($(this).attr("id").slice(3));
      // console.log();
      let day = $(this).attr("id").slice(1, 2) - 1;
      $(".date_time_original").val(`${start}.${day}.${hour}`);
      $(".date_time").val(`${start}.${day}.${hour}`);
      $(".datetime").text(`${days[day]} at ${hours[hour]}`);
      $(".update_form").css("display", "");
      $(".new_form").css("display", "none");
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
            .html(`${text} (${index + 1} hour)`)
        );
      });
      let valueOfColspan = $(this).attr("colspan");
      if (!valueOfColspan) {
        $(".original_len").val(0);
      } else {
        $(".original_len").val($(this).attr("colspan") - 1);
      }

      $(
        `#task option[value='${schedule[start].weekdays[day].schedule[hour].task.job}']`
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
    $(".new_form").css("display", "none").trigger("reset");
    $(".notification").text("Added!. ");
    loadData();
  });

  // Deleting an entry
  $(document.body).on("click", ".delete", function () {
    console.log("delete clicked");
    let form = $(this).parent("form");
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
    //  Infomr User
    $(".update_form").css("display", "none").trigger("reset");
    $(".notification").text("Deleted").addClass("success");
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
    $(".update_form").css("display", "none").trigger("reset");
    $(".notification").text("Edited").addClass("success");
    loadData();
  });

  $(document.body).on("click", ".report", function () {
    console.log("clicked");
    reporting(schedule, 7);
  });

  loadData();
});
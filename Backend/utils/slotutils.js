
import moment from "moment";

/**
 * generateSlotsForDate(dateStr, fromTime, toTime, slotMinutes)
 * dateStr: "DD-MM-YYYY"
 * fromTime/toTime: "HH:mm"
 * returns array of slots: { date, startTime, endTime, booked:false }
 */
export function generateSlotsForDate(dateStr, fromTime = "09:00", toTime = "12:00", slotMinutes = 45) {
  const slots = [];
  let cursor = moment(`${dateStr} ${fromTime}`, "DD-MM-YYYY HH:mm");
  const end = moment(`${dateStr} ${toTime}`, "DD-MM-YYYY HH:mm");

  while (cursor.clone().add(slotMinutes, "minutes").isSameOrBefore(end)) {
    const start = cursor.clone();
    const finish = cursor.clone().add(slotMinutes, "minutes");
    if (finish.isAfter(end)) break;

    slots.push({
      date: moment(start).format("DD-MM-YYYY"),
      startTime: moment(start).format("HH:mm"),
      endTime: moment(finish).format("HH:mm"),
      booked: false,
      appointmentId: null,
    });

    cursor = finish;
  }

  return slots;
}

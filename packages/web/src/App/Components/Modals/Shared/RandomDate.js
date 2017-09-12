//generate random times for testing
const startHour = 0;
const endHour = 24;

export const randomDate = (startDate, endDate) => {
  var date = new Date(+startDate + Math.random() * (endDate - startDate));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
}
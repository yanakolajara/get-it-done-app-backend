const dateToObject = (date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    monthName: date.toLocaleString("default", { month: "long" }),
    day: date.getDate(),
    dayName: date.getDay(),
  };
};

const dateObjToString = ({ year, month, day }) => {
  let formattedMonth = String(month).padStart(2, "0");
  let formattedDay = String(day).padStart(2, "0");
  return `${year}-${formattedMonth}-${formattedDay}`;
};

const getDayObj = () => {
  let date = new Date();
  return dateToObject(date);
};

const getDayStr = () => {
  return dateObjToString(getDayObj());
};

module.exports = {
  dateObjToString,
  dateToObject,
  getDayObj,
  getDayStr,
};

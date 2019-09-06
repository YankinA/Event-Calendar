// Сравнивает две даты по году месяцу и дню.
const compareDates = (firstDate, lastDate) => firstDate.getDate() === lastDate.getDate() &&
  firstDate
    .getMonth() === lastDate.getMonth() && firstDate.getFullYear() === lastDate.getFullYear();
  // Приводит дату к формату 2000-01-01
const changeDateFormat = (date) => {
  const mouth = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  return `${date.getFullYear()}-${mouth}-${day}`;
};

// Выводим дни месяца и выделяем сегодняшний день если он есть.
// Присваиваем элементам id равным дате, для добавления события в нужный день.
const renderCalendarDay = (calendar) => {
  const calendarDayList = document.querySelectorAll('.calendar-day');
  const today = document.querySelector('.today');
  today && today.classList.remove('today');
  calendar.dateList.forEach((date, i) => {
    if (compareDates(date, calendar.selectedDate)) {
      calendarDayList[i].classList.add('today');
    }
    const calendarDayNumber = calendarDayList[i].querySelector('.calendar-day-number');
    calendarDayNumber.innerHTML = date.getDate();
    calendarDayList[i].id = changeDateFormat(date);
  });
};

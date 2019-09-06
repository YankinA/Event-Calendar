const renderCalendarCurrentDate = (calendar) => {
  const calendarCurrentDate = document.querySelector('.calendar-current-date');
  const month = calendar.months[calendar.currentDate.month];
  calendarCurrentDate
    .innerHTML = `${month ? month.charAt(0).toUpperCase() + month.slice(1) : ''} ${calendar.currentDate.year}`;
};

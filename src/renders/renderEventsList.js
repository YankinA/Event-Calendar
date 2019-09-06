// выводит события по текущей дате
const renderEventsList = (calendar) => {
  const dayEventAddedList = document.querySelectorAll('.calendar-day-event-added');
  dayEventAddedList.forEach((day) => {
    day.classList.remove('calendar-day-event-added');
    day.querySelector('.calendar-day-event-list').innerHTML = '';
  });
  const eventValues = Object.values(calendar.events);
  eventValues.forEach((eventValue) => {
    const {
      id,
      event,
      date,
      names,
    } = eventValue;
    const day = document.getElementById(date);
    if (day) {
      const template = document.querySelector('#tmpl');
      const calendarDayEvent = template.content.querySelector('.calendar-day-event').cloneNode(true);
      calendarDayEvent.id = id;
      day.classList.add('calendar-day-event-added');
      calendarDayEvent.querySelector('.calendar-day-event-topic').innerHTML = event;
      calendarDayEvent.querySelector('.calendar-day-event-members').innerHTML = names;
      day.querySelector('.calendar-day-event-list').appendChild(calendarDayEvent);
      const calendarDayEventList = day.querySelector('.calendar-day-event-list');
      const numberOfEvents = {
        1: () => {
          calendarDayEventList.classList.remove('calendar-day-event-list_two-events');
        },
        2: () => {
          calendarDayEventList.classList.add('calendar-day-event-list_two-events');
        },
        3: () => {
          calendarDayEventList.classList.add('calendar-day-event-list_three-events');
        },
        many: () => {
          const calendarDayEventBtnOpenList = day.querySelector('.calendar-day-event-btn-open-list');
          calendarDayEventBtnOpenList.classList.remove('display_none');
          calendarDayEventBtnOpenList.innerHTML = `еще ${calendarDayEventList.children.length - 3}`;
        },
      };
      const numberOfEventsPerDay = calendarDayEventList.children.length > 3 ? 'many' : calendarDayEventList.children.length;
      numberOfEvents[numberOfEventsPerDay]();
    }
  });
};

const removeEvent = ({ modals: { modalAddEvent: { eventId } } }) => {
  const eventIdNode = document.getElementById(eventId);
  const calendarDayEventList = eventIdNode.parentNode;
  calendarDayEventList.removeChild(eventIdNode);
  const calendarDayEventBtnOpenList = calendarDayEventList.parentNode.querySelector('.calendar-day-event-btn-open-list');
  const numberOfEvents = {
    0: () => {
      calendarDayEventList.parentNode.classList.remove('calendar-day-event-added');
    },
    1: () => {
      calendarDayEventList.classList.remove('calendar-day-event-list_two-events');
    },
    2: () => {
      calendarDayEventList.classList.add('calendar-day-event-list_two-events');
      calendarDayEventList.classList.remove('calendar-day-event-list_three-events');
    },
    3: () => {
      calendarDayEventList.classList.add('calendar-day-event-list_three-events');
      calendarDayEventBtnOpenList.classList.add('display_none');
    },
    many: () => {
      calendarDayEventBtnOpenList.innerHTML = `еще ${calendarDayEventList.children.length - 3}`;
    },
  };
  const numberOfEventsPerDay = calendarDayEventList.children.length > 3 ? 'many' : calendarDayEventList.children.length;
  numberOfEvents[numberOfEventsPerDay]();
};

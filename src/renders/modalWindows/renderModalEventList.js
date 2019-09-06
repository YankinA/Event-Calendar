const renderModalEventList = ({
  events,
  modals: {
    modalEventList:
      {
        state,
        date,
        months,
        daysWeek,
      },
  },
}) => {
  const modalEventListDayDate = document.querySelector('.modal-event-list-day-date');
  const dateObj = new Date(date);
  modalEventListDayDate.innerHTML =
    `${dateObj.getDate()}${months[dateObj.getMonth()]}'${String(dateObj.getFullYear()).slice(-2)}, ${daysWeek[dateObj.getDay() - 1]}`;
  const eventsValue = Object.values(events).filter(event => event.date === date);
  const modalEventListNode = document.querySelector('.modal-event-list');
  const modalEventListEvents = modalEventListNode.querySelector('.modal-event-list-events');
  const modalBackground = document.querySelector('.modal-background');
  const modalEventListStateMachine = {
    open: () => {
      modalBackground.classList.remove('display_none');
      eventsValue.forEach((event) => {
        const template = document.querySelector('#tmpl');
        const modalEventListEvent = template.content.querySelector('.modal-event-list-event').cloneNode(true);
        modalEventListEvent.querySelector('.modal-event-list-event-title').innerHTML = event.event;
        modalEventListEvent.querySelector('.modal-event-list-event-description').innerHTML = event.description;
        modalEventListEvent.querySelector('.modal-event-list-event-names').innerHTML = event.names;
        modalEventListEvent.dataset.date = event.date;
        modalEventListEvent.dataset.id = event.id;
        modalEventListEvents.appendChild(modalEventListEvent);
      });
      modalEventListNode.classList.remove('display_none');
    },
    closed: () => {
      modalBackground.classList.add('display_none');
      modalEventListNode.classList.add('display_none');
      modalEventListEvents.innerHTML = '';
    },
  };
  modalEventListStateMachine[state]();
};

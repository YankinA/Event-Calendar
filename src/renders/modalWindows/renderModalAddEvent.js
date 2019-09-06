// Выводим модальное окно календаря
const renderModalAddEvent = ({ events, modals: { modalAddEvent: { state, coordinates, inputsData, eventId, months } } }) => {
  const calendarDaysTable = document.querySelector('.calendar-days-table');
  const modalAddEvent = document.querySelector('.modal-add-event');
  const modalAddEventPointer = modalAddEvent.querySelector('.modal-add-event-pointer');

  const modalAddEventItems = modalAddEvent.querySelectorAll('.modal-add-event-item');

  const inputEvent = modalAddEvent.querySelector('.input-title');
  const inputDate = modalAddEvent.querySelector('.input-date');
  const inputNames = modalAddEvent.querySelector('.input-names');
  const inputDescription = modalAddEvent.querySelector('.input-description');

  const eventTitle = modalAddEvent.querySelector('.event-title');
  const eventDate = modalAddEvent.querySelector('.event-date');
  const eventNames = modalAddEvent.querySelector('.event-names');
  const eventDescription = modalAddEvent.querySelector('.event-description');
  const modalBackground = document.querySelector('.modal-background');
  const modalAddEventStateMachine = {
    open: () => {
      modalBackground.classList.remove('display_none');
      const modalAddEventBtnSend = document.querySelector('.modal-add-event-btn_send');
      if (eventId && events[eventId]) {
        modalAddEventBtnSend.removeAttribute('disabled');
        inputEvent.value = events[eventId].event;
        eventTitle.textContent = events[eventId].event;
        inputDate.value = events[eventId].date;
        eventDate.textContent = `${new Date(events[eventId].date).getDate()} ${months[new Date(events[eventId].date).getMonth()]}`;
        inputNames.value = events[eventId].names;
        eventNames.innerHTML = `<span>Участники:</span><br>${events[eventId].names}`;
        inputDescription.value = events[eventId].description;
        eventDescription.textContent = events[eventId].description;
        // Данные события заполненны то они выводятся тестом, если нет выводится input;
        modalAddEventItems.forEach((item, i) => {
          if (item.value && item.value.length) {
            item.classList.toggle('display_none');
            modalAddEventItems[i + 1].classList.toggle('display_none');
          }
        });
      } else {
        modalAddEventBtnSend.setAttribute('disabled', 'true');
      }
      // Меняем позицию модального окна в зависимости от выбранной ячейки таблицы.
      // эти магические цифры - исходный координаты модального окна.
      const { cell, row } = coordinates;
      modalAddEvent.style.top = `${((row > 2) ? -217 : 33) + (row * 115)}px`;
      modalAddEvent.style.left = `${((cell > 5) ? -86 : 364) + (cell * 128.5)}px`;
      modalAddEventPointer.style.top = `${(row > 2) ? 272 : 22}px`;
      modalAddEventPointer.style.left = `${(cell > 5) ? 293 : -7}px`;
      modalAddEventPointer.style.transform = `rotate(${(cell > 5) ? 225 : 45}deg)`;
      inputDate.value = inputsData.date;
      calendarDaysTable.rows[row].cells[cell].classList.add('calendar-day-active');
      modalAddEvent.classList.remove('display_none');
      inputEvent.focus();
    },
    closed: () => {
      modalBackground.classList.add('display_none');
      const calendarDayActive = document.querySelector('.calendar-day-active');
      calendarDayActive && calendarDayActive.classList.remove('calendar-day-active');
      modalAddEvent.classList.add('display_none');
      modalAddEventItems.forEach((item) => {
        const itemType = item.dataset.type.slice(-4);
        itemType === 'edit' ? item.classList.remove('display_none') : item.classList.add('display_none');
      });
      inputEvent.value = '';
      inputNames.value = '';
      inputDescription.value = '';
    },
  };
  modalAddEventStateMachine[state]();
};

// Валидация
const renderValidationModalAddEvent = ({ modals: { modalAddEvent: { inputsData } } }) => {
  const modalAddEventBtnSend = document.querySelector('.modal-add-event-btn_send');
  const modalAddEventError = document.querySelector('.modal-add-event-error');
  if (!inputsData.title.replace(/\s/g, '')) {
    modalAddEventBtnSend.setAttribute('disabled', 'true');
    const errorText = 'введите событие';
    modalAddEventError.textContent = errorText;
    setTimeout(() => {
      modalAddEventError.textContent = '';
    }, 1000);
  } else {
    modalAddEventBtnSend.removeAttribute('disabled');
  }
};

const editIngItemModalAddEvent = ({ modals: { modalAddEvent: { edit } } }) => {
  Object.keys(edit).forEach((key) => {
    if (edit[key] === 'editing') {
      const ModalAddEventItem = document.querySelector(`.input-${key}`);
      ModalAddEventItem.classList.remove('display_none');
      const ModalAddEventItemEdit = document.querySelector(`.event-${key}`);
      ModalAddEventItemEdit.classList.add('display_none');
    }
  });
};

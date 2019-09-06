// Древний способ зрабить код на модули через замыкания
(() => {
  const calendar = {
    daysWeek: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    dateList: [],
    currentDate: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
    selectedDate: new Date(),
    events: {},
    modals: {
      modalAddEvent: {
        inputsData: {
          title: '',
          date: null,
        },
        state: 'closed',
        edit: {
          title: 'static',
          date: 'static',
          names: 'static',
          description: 'static',
        },
        coordinates: {},
        eventId: null,
        months: ['января', 'февраля', ' марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
      },
      modalSearch: {
        input: '',
      },
      modalAddEventFast: {
        state: 'closed',
        input: '',
      },
      modalEventList: {
        state: 'closed',
        date: null,
        months: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
        daysWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      },
    },
  };

  // Отслеживаем изминения или чтение в calendar
  const watchingСhanges = (obj, ...renders) => new Proxy(obj, {
    set: (target, key, value/* receiver */) => {
      target[key] = value;
      renders.forEach(render => render(calendar));
      return true;
    },
  });
  /*
   const watchingReading = (obj, ...renders) => new Proxy(obj, {
       get: (target, key) => {
         renders.forEach(render => render());
         return target[key];
       },
     });
     */

  /*
   Передаем в proxy объекты  за которыми планируем следить и render
  отооброжающий данные из соотсвующего объекта.
   Далее любые изминения с proxy объектом или обращение к нему запускают соответсвующий render.
   */
  const proxyEvents = watchingСhanges(calendar, addEvent);
  const proxyEventsRemove = watchingСhanges(calendar, removeEvent);
  const proxyСalendarСurrentDate = watchingСhanges(calendar.currentDate, renderCalendarCurrentDate);
  const proxyCalendarDateList =
    watchingСhanges(calendar, renderDaysTable, renderCalendarDay, renderEventsList);
  const proxyModalAddEvent = watchingСhanges(calendar.modals.modalAddEvent, renderModalAddEvent);
  const proxyModalAddEventInputsData =
   watchingСhanges(calendar.modals.modalAddEvent.inputsData, renderValidationModalAddEvent);
  const proxyModalAddEventEdit =
   watchingСhanges(calendar.modals.modalAddEvent.edit, editIngItemModalAddEvent);
  const proxyModalSearch = watchingСhanges(calendar.modals.modalSearch, renderSearchModal);
  const proxyModalAddEventFast =
   watchingСhanges(calendar.modals.modalAddEventFast, renderModalAddEventFast);
  const proxyModalEventList = watchingСhanges(calendar.modals.modalEventList, renderModalEventList);

  const randomIdEvent = () => {
    const id = `${Math.floor(Math.random() * 10000000000000001)}${new Date()}`;
    const idList = Object.keys(calendar.events);
    if (idList.includes(id)) {
      randomIDEvent();
    }
    return id;
  };

  // обновляет массив с датами месяцев, помещающихся на странице(всего 35 или 42 дня).
  const updateDateList = (year, month) => {
    const monthDays = [];
    const endDayLastMonthWeek = new Date(year, month, 0).getDay();
    const endDayLastMonth = new Date(year, month, 0).getDate();
    for (let i = endDayLastMonth; monthDays.length < endDayLastMonthWeek; i -= 1) {
      monthDays.unshift(new Date(year, month - 1, i));
    }
    const endDayCurrentMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= endDayCurrentMonth; i += 1) {
      monthDays.push(new Date(year, month, i));
    }
    const lengthcalendarDayNumberList = monthDays.length > 35 ? 42 : 35;
    for (let i = 1; monthDays.length < lengthcalendarDayNumberList; i += 1) {
      monthDays.push(new Date(year, month + 1, i));
    }
    return monthDays;
  };

  const opensModalAddEvent = (id, cell, row, defaultDate) => {
    proxyModalAddEvent.eventId = id;
    proxyModalAddEvent.inputsData.date = defaultDate;
    proxyModalAddEvent.coordinates.cell = cell;
    proxyModalAddEvent.coordinates.row = row;
    proxyModalSearch.input = '';
    proxyModalEventList.state = 'closed';
    proxyModalAddEvent.state = 'open';
  };

  proxyCalendarDateList.dateList = updateDateList(
    calendar.selectedDate.getFullYear(),
    calendar.selectedDate.getMonth(),
  );
  proxyСalendarСurrentDate.month = new Date().getMonth();
  proxyСalendarСurrentDate.year = new Date().getFullYear();

  // переключает на предыдущий месяц
  const btnNextPrevious = document.querySelector('.btn-previous-month');
  btnNextPrevious.addEventListener('click', () => {
    proxyСalendarСurrentDate.month -= 1;
    if (proxyСalendarСurrentDate.month < 0) {
      proxyСalendarСurrentDate.month = 11;
      proxyСalendarСurrentDate.year -= 1;
    }
    proxyCalendarDateList
      .dateList = updateDateList(calendar.currentDate.year, calendar.currentDate.month);
  });

  // переключает на следующий месяц.
  const btnNextMonth = document.querySelector('.btn-next-month');
  btnNextMonth.addEventListener('click', () => {
    proxyСalendarСurrentDate.month += 1;
    if (proxyСalendarСurrentDate.month > 11) {
      proxyСalendarСurrentDate.month = 0;
      proxyСalendarСurrentDate.year += 1;
    }
    proxyCalendarDateList
      .dateList = updateDateList(calendar.currentDate.year, calendar.currentDate.month);
  });

  // возвращаемся к сегодняшней  дате календаря.Кнопка "Сегодня".
  const btnToday = document.querySelector('.btn-today');
  btnToday.addEventListener('click', () => {
    proxyСalendarСurrentDate.month = calendar.selectedDate.getMonth();
    proxyСalendarСurrentDate.year = calendar.selectedDate.getFullYear();
    proxyCalendarDateList
      .dateList = updateDateList(
        calendar.selectedDate.getFullYear(),
        calendar.selectedDate.getMonth(),
      );
  });

  // Вешаем на таблицу обработчик вызова модального окна.
  // записываем кординаты модального окна на которое кликнули.
  const calendarDaysTable = document.querySelector('.calendar-days-table');
  calendarDaysTable.addEventListener('click', (e) => {
    const { modalEventList } = calendar.modals;
    let element = e.target;
    const calendarDayElements = {
      'calendar-day-event': () => {
        const calendarDay = element.parentNode.parentNode;
        opensModalAddEvent(
          element.id,
          calendarDay.cellIndex,
          calendarDay.parentNode.rowIndex,
          calendarDay.id,
        );
      },
      'calendar-day': () => {
        opensModalAddEvent(null, element.cellIndex, element.parentNode.rowIndex, element.id);
      },
      'btn-open-list-event': () => {
        modalEventList.date = element.parentNode.id;
        proxyModalEventList.state = 'open';
      },
    };
    while (element !== calendarDaysTable) {
      calendar.modals.modalAddEvent.eventId = null;
      if (calendarDayElements[element.dataset.type]) {
        calendarDayElements[element.dataset.type]();
        break;
      }
      element = element.parentNode;
      calendar.modals.modalAddEvent.eventId = null;
    }
  });
  //  Кнопки модального окна
  const modalAddEvent = document.querySelector('.modal-add-event');
  modalAddEvent.addEventListener('click', (e) => {
    const modalAddEventElement = {
      closed: () => {
        // меняем состояние модального окна на closed. Кнопка "x";
        proxyModalAddEvent.state = 'closed';
      },
      send: () => {
        // сохранить событие, кнопка "готово"
        const inputTitle = document.querySelector('.input-title');
        const inputDate = document.querySelector('.input-date');
        const inputNames = document.querySelector('.input-names');
        const inputDescription = document.querySelector('.input-description');
        const { eventId } = calendar.modals.modalAddEvent;
        const id = calendar.events[eventId] ? eventId : randomIdEvent();
        if (proxyEventsRemove.events[eventId]) {
          const values = Object.values(proxyEventsRemove.events);
          proxyEventsRemove.events = values.reduce((acc, event) =>
            (eventId !== event.id ? { ...acc, [event.id]: event } : acc), {});
        }
        calendar.modals.modalAddEvent.eventId = id;
        const event = {
          id: calendar.modals.modalAddEvent.eventId,
          event: inputTitle.value.replace(/^\s*/, ''),
          date: inputDate.value,
          names: inputNames.value.replace(/^\s*/, ''),
          description: inputDescription.value.replace(/^\s*/, ''),
        };
        proxyEvents.events = { ...proxyEvents.events, [id]: event };
        proxyModalAddEvent.state = 'closed';
      },
      remove: () => {
        const { eventId } = calendar.modals.modalAddEvent;
        if (proxyEventsRemove.events[eventId]) {
          const values = Object.values(proxyEventsRemove.events);
          proxyEventsRemove.events = values.reduce((acc, event) =>
            (eventId !== event.id ? { ...acc, [event.id]: event } : acc), {});
        }
        proxyModalAddEvent.state = 'closed';
      },
      title: () => {
        proxyModalAddEventEdit.title = 'editing';
        proxyModalAddEventEdit.title = 'static';
      },
      date: () => {
        proxyModalAddEventEdit.date = 'editing';
        proxyModalAddEventEdit.date = 'static';
      },
      names: () => {
        proxyModalAddEventEdit.names = 'editing';
        proxyModalAddEventEdit.names = 'static';
      },
      description: () => {
        proxyModalAddEventEdit.description = 'editing';
        proxyModalAddEventEdit.description = 'static';
      },
    };
    modalAddEventElement[e.target.dataset.type] && modalAddEventElement[e.target.dataset.type]();
  });

  const modalEventList = document.querySelector('.modal-event-list');
  modalEventList.addEventListener('click', (e) => {
    const modalElements = {
      event: (element) => {
        const calendarDay = document.getElementById(element.dataset.date);
        opensModalAddEvent(
          element.dataset.id,
          calendarDay.cellIndex,
          calendarDay.parentNode.rowIndex,
          element.dataset.date,
        );
      },
      closed: () => {
        proxyModalEventList.state = 'closed';
      },
    };
    let element = e.target;
    while (element !== modalEventList) {
      if (modalElements[element.dataset.type]) {
        modalElements[element.dataset.type](element);
        break;
      }
      element = element.parentNode;
    }
  });

  const ModalAddEventInputTitle = document.querySelector('.input-title');
  ModalAddEventInputTitle.addEventListener('input', () => {
    proxyModalAddEventInputsData.title = ModalAddEventInputTitle.value;
  });

  const headerSearchInput = document.querySelector('.header-search-input');
  headerSearchInput.addEventListener('input', () => {
    proxyModalSearch.input = headerSearchInput.value;
  });

  const headerSearchModalBtnClosed = document.querySelector('.header-search-modal-btn_closed');
  headerSearchModalBtnClosed.addEventListener('click', () => {
    proxyModalSearch.input = '';
  });

  const headerSearchModalEvents = document.querySelector('.header-search-modal-events');
  headerSearchModalEvents.addEventListener('click', (evt) => {
    let element = evt.target;
    while (element !== headerSearchModalEvents) {
      if (element.dataset.date) {
        const date = new Date(element.dataset.date);
        const calendarDay = document.getElementById(element.dataset.date);
        if (calendarDay) {
          opensModalAddEvent(
            element.dataset.id,
            calendarDay.cellIndex,
            calendarDay.parentNode.rowIndex,
            element.dataset.date,
          );
          break;
        } else {
          proxyСalendarСurrentDate.month = date.getMonth();
          proxyСalendarСurrentDate.year = date.getFullYear();
          proxyCalendarDateList.dateList = updateDateList(date.getFullYear(), date.getMonth());
          const calendarDayDate = document.getElementById(element.dataset.date);
          opensModalAddEvent(
            element.dataset.id,
            calendarDayDate.cellIndex,
            calendarDayDate.parentNode.rowIndex,
            element.dataset.date,
          );
          break;
        }
      }
      element = evt.target.parentNode;
    }
  });

  const headerModalAddEventFastInput = document.querySelector('.header-modal-add-event-fast-input');
  headerModalAddEventFastInput.addEventListener('keyup', (e) => {
    const inputValue = headerModalAddEventFastInput.value;
    const regExp = new RegExp(`${proxyModalAddEvent.months.join('|')}`);
    proxyModalAddEventFast.input = e.keyCode !== 8 && inputValue.search(/,/) === -1 ? inputValue.replace(regExp, str => `${str}, `) : inputValue;
  });

  const headerModalAddEventFastOpen = document.querySelector('.header-modal-add-event-fast-open');
  headerModalAddEventFastOpen.addEventListener('click', () => {
    proxyModalAddEventFast.state = 'open';
  });

  const headerModalAddEventFastClosed = document.querySelector('.header-modal-add-event-fast_closed');
  headerModalAddEventFastClosed.addEventListener('click', () => {
    proxyModalAddEventFast.state = 'closed';
  });

  const headerModalAddEventFastSend = document.querySelector('.header-modal-add-event-fast_send');
  headerModalAddEventFastSend.addEventListener('click', () => {
    const regExp = new RegExp(`${proxyModalAddEvent.months.join('|')}`);
    const eventDataList = proxyModalAddEventFast.input.split(',');
    const dateText = eventDataList[0];
    const eventTitle = eventDataList[1].replace(/^\s*/, '');
    const day = Number(dateText.match(/\d/gi).join(''));
    const month = proxyModalAddEvent.months.indexOf(dateText.match(regExp)[0]) + 1;
    const id = randomIdEvent();
    calendar.modals.modalAddEvent.eventId = id;
    const date = `${calendar.selectedDate.getFullYear()}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
    const event = {
      id: calendar.modals.modalAddEvent.eventId,
      event: eventTitle,
      date,
      names: '',
      description: '',
    };
    proxyEvents.events = { ...proxyEvents.events, [id]: event };
    proxyModalAddEventFast.state = 'closed';
    proxyModalAddEventFast.input = '';
    proxyСalendarСurrentDate.month = month - 1;
    proxyCalendarDateList
      .dateList = updateDateList(calendar.currentDate.year, calendar.currentDate.month);
  });

  const modalBackground = document.querySelector('.modal-background');
  modalBackground.addEventListener('click', () => {
    proxyModalAddEventFast.state = 'closed';
    proxyModalAddEventFast.input = '';
    proxyModalAddEvent.state = 'closed';
    proxyModalSearch.input = '';
    proxyModalEventList.state = 'closed';
  });
  const headerBtnReload = document.querySelector('.header-btn-reload');
  headerBtnReload.addEventListener('click', () => document.location.reload(false));
  // запись событий в localStorage
  window.onunload = () => {
    localStorage.events = JSON.stringify(calendar.events);
  };
  // вывод событий из localStorage
  window.onload = () => {
    proxyCalendarDateList.events = JSON.parse(localStorage.events);
  };
})();

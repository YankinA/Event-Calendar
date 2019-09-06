const renderModalAddEventFast = ({ modals: { modalAddEvent: { months }, modalAddEventFast: { state, input } } }) => {
  const headerModalAddEventFast = document.querySelector('.header-modal-add-event-fast');
  const headerModalAddEventFastInput = document.querySelector('.header-modal-add-event-fast-input');
  headerModalAddEventFastInput.value = input;
  const modalBackground = document.querySelector('.modal-background');
  const stateModal = {
    open: () => {
      headerModalAddEventFast.classList.remove('display_none');
      modalBackground.classList.remove('display_none');
    },
    closed: () => {
      headerModalAddEventFast.classList.add('display_none');
      modalBackground.classList.add('display_none');
    },
  };
  stateModal[state]();
  const headerModalAddEventFastError = document.querySelector('.header-modal-add-event-fast-error');
  const headerModalAddEventFastSend = document.querySelector('.header-modal-add-event-fast_send');
  const regExp = new RegExp(`${months.join('|')}`);
  const eventDataList = input.split(',');
  const dateText = eventDataList[0];
  const eventTitle = eventDataList[1];
  // Валидация
  if (dateText.match(/\d/gi) && dateText.match(regExp) && eventTitle.replace(/\s/g, '')) {
    headerModalAddEventFastSend.removeAttribute('disabled');
  }
  else {
    headerModalAddEventFastSend.setAttribute('disabled', 'true');
    const errorText = dateText.match(/\d/gi) && dateText.match(regExp) ? 'введите событие' : 'введите дату';
    headerModalAddEventFastError.textContent = errorText;
    setTimeout(() => {
      headerModalAddEventFastError.textContent = '';
    }, 1000);
  }
};

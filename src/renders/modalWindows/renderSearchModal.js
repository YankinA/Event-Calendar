const lookingForKeywords = (text, keywords) => {
  const wordLIst = keywords.map(word => `^${word}| ${word}`).join('|');
  const regexp = new RegExp(`${wordLIst}`, 'gi');
  const uniqueWordList = Array.from(new Set(text.match(regexp)));
  const wordListLengthCompare = keywords.length === uniqueWordList.length;
  return wordListLengthCompare ? text.replace(regexp, str => `<b>${str}</b>`) : wordListLengthCompare;
};

const renderSearchModal = ({ events, modals: { modalSearch, modalAddEvent: { months } } }) => {
  const headerSearchInput = document.querySelector('.header-search-input');
  const headerSearchModalEvents = document.querySelector('.header-search-modal-events');
  headerSearchModalEvents.innerHTML = '';
  const btnClosed = document.querySelector('.header-search-modal-btn_closed');
  const searchModal = document.querySelector('.header-search-modal');
  const modalBackground = document.querySelector('.modal-background');
  const headerSearchWrap = document.querySelector('.header-search-wrap');
  if (modalSearch.input.length > 0) {
    headerSearchWrap.style.zIndex = '100';
    modalBackground.classList.remove('display_none');
    const keywords = modalSearch.input.split(' ').filter(w => w !== '');
    const eventValues = Object.values(events);
    eventValues.forEach((eventData) => {
      const date = new Date(eventData.date);
      const dateFormat = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      if (
        lookingForKeywords(eventData.event, keywords) ||
        lookingForKeywords(eventData.names, keywords) ||
        lookingForKeywords(dateFormat, keywords)
      ) {
        const template = document.querySelector('#tmpl');
        const headerSearchModalEvent = template.content.querySelector('.header-search-modal-event').cloneNode(true);
        const headerSearchModalEventTitle = headerSearchModalEvent.querySelector('.header-search-modal-event-title');
        headerSearchModalEventTitle
          .innerHTML = lookingForKeywords(eventData.event, keywords) || eventData.event;
        const headerSearchModalEventDate = headerSearchModalEvent.querySelector('.header-search-modal-event-date');
        headerSearchModalEventDate
          .innerHTML = lookingForKeywords(dateFormat, keywords) || dateFormat;
        const headerSearchModalEventNames = headerSearchModalEvent.querySelector('.header-search-modal-event-names');
        headerSearchModalEventNames
          .innerHTML = lookingForKeywords(eventData.names, keywords) || eventData.names;
        headerSearchModalEvent.dataset.id = eventData.id;
        headerSearchModalEvent.dataset.date = eventData.date;
        headerSearchModalEvents.appendChild(headerSearchModalEvent);
      }
    });
    btnClosed.classList.remove('display_none');
    searchModal.classList.remove('display_none');
  } else {
    headerSearchWrap.style.zIndex = '1';
    modalBackground.classList.add('display_none');
    btnClosed.classList.add('display_none');
    searchModal.classList.add('display_none');
  }
  headerSearchInput.value = modalSearch.input;
};

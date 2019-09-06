// выводим месяц и год выбранный пользователем
// Рисуем календарь
const renderDaysTable = (calendar) => {
  const row = calendar.dateList.length === 35 ? 5 : 6;
  const cell = 7;
  const table = document.querySelector('.calendar-days-table');
  const template = document.querySelector('#tmpl');
  table.innerHTML = '';
  for (let i = 0; i < row; i += 1) {
    const tr = document.createElement('tr');
    for (let j = 0; j < cell; j += 1) {
      const td = template.content.querySelector('.calendar-day').cloneNode(true);
      td.querySelector('.calendar-day-week').innerHTML = !table.childNodes.length ? `${calendar.daysWeek[j]},` : null;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
};

(function(){
  const events = [];
  let current = new Date();
  current = new Date(current.getFullYear(), current.getMonth(), 1);
  let calendarContainer = null;

  function formatDateKey(year, month, day){
    return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }

  function capitalizeLabel(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function createEventCard(event){
    const card = document.createElement('div');
    card.className = 'event-card';
    const title = document.createElement('h4');
    title.textContent = event.title || 'Мероприятие';
    const description = document.createElement('p');
    description.textContent = event.description ? event.description : event.date;
    card.appendChild(title);
    card.appendChild(description);
    return card;
  }

  function build(){
    if(!calendarContainer) return;
    calendarContainer.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'calendar-header';

    const title = document.createElement('div');
    title.className = 'calendar-title';
    title.textContent = capitalizeLabel(current.toLocaleString(undefined, {month: 'long', year: 'numeric'}));

    const nav = document.createElement('div');
    nav.className = 'calendar-nav';
    const prev = document.createElement('button'); prev.textContent = '<';
    const next = document.createElement('button'); next.textContent = '>';
    prev.addEventListener('click', ()=>{ current = new Date(current.getFullYear(), current.getMonth()-1, 1); build(); });
    next.addEventListener('click', ()=>{ current = new Date(current.getFullYear(), current.getMonth()+1, 1); build(); });
    nav.appendChild(prev);
    nav.appendChild(next);

    header.appendChild(title);
    header.appendChild(nav);
    calendarContainer.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    const weekdays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    weekdays.forEach(day => {
      const w = document.createElement('div');
      w.className = 'calendar-weekday';
      w.textContent = day;
      grid.appendChild(w);
    });

    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1);
    const leading = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    for(let i = 0; i < leading; i++){
      const cell = document.createElement('div');
      cell.className = 'calendar-day other-month';
      const dateSpan = document.createElement('div');
      dateSpan.className = 'date';
      dateSpan.textContent = prevDays - leading + 1 + i;
      cell.appendChild(dateSpan);
      grid.appendChild(cell);
    }

    for(let day = 1; day <= daysInMonth; day++){
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      const dateSpan = document.createElement('div');
      dateSpan.className = 'date';
      dateSpan.textContent = day;

      const today = new Date();
      if(day === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
        cell.classList.add('today');
      }

      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.className = 'day-add-button';
      addButton.title = 'Создать событие';
      addButton.setAttribute('aria-label', 'Создать событие');
      const addIcon = document.createElement('img');
      addIcon.src = '../assets/ui/add.svg';
      addIcon.alt = '';
      addIcon.className = 'day-add-icon';
      addButton.appendChild(addIcon);
      addButton.addEventListener('click', function(event){
        event.stopPropagation();
        openModal(formatDateKey(year, month, day));
      });

      cell.appendChild(dateSpan);
      cell.appendChild(addButton);

      const dateKey = formatDateKey(year, month, day);
      const dayEvents = events.filter(event => event.date === dateKey);
      if(dayEvents.length){
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'events';
        dayEvents.forEach(event => eventsContainer.appendChild(createEventCard(event)));
        cell.appendChild(eventsContainer);
      }

      grid.appendChild(cell);
    }

    const totalCells = leading + daysInMonth;
    const trailing = (7 - (totalCells % 7)) % 7;
    for(let i = 1; i <= trailing; i++){
      const cell = document.createElement('div');
      cell.className = 'calendar-day other-month';
      const dateSpan = document.createElement('div');
      dateSpan.className = 'date';
      dateSpan.textContent = i;
      cell.appendChild(dateSpan);
      grid.appendChild(cell);
    }

    calendarContainer.appendChild(grid);
  }

  function openModal(dateValue){
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('eventModal');
    const dateInput = document.getElementById('eventDate');
    const today = new Date();
    dateInput.value = dateValue || formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
    overlay.classList.add('open');
    modal.classList.add('open');
  }

  function closeModal(){
    document.getElementById('modalOverlay').classList.remove('open');
    document.getElementById('eventModal').classList.remove('open');
  }

  function init(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    calendarContainer = el;
    build();
  }

  window.SimpleCalendar = {
    init,
    openModal,
    closeModal,
    addEvent(event){
      events.push(event);
      build();
    }
  };
})();

document.addEventListener('DOMContentLoaded', function(){
  SimpleCalendar.init('#simple-calendar');

  const addEventButton = document.getElementById('addEventButton');
  const closeModalButton = document.getElementById('closeModal');
  const cancelModalButton = document.getElementById('cancelModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const eventForm = document.getElementById('eventForm');

  if(addEventButton){
    addEventButton.addEventListener('click', function(){
      SimpleCalendar.openModal();
    });
  }

  [closeModalButton, cancelModalButton, modalOverlay].forEach(el => {
    if(el){
      el.addEventListener('click', function(){
        SimpleCalendar.closeModal();
      });
    }
  });

  if(eventForm){
    eventForm.addEventListener('submit', function(event){
      event.preventDefault();
      const title = document.getElementById('eventTitle').value.trim();
      const date = document.getElementById('eventDate').value;
      const description = document.getElementById('eventDescription').value.trim();
      if(!date){
        return;
      }
      SimpleCalendar.addEvent({
        title: title || 'Мероприятие',
        date,
        description
      });
      eventForm.reset();
      SimpleCalendar.closeModal();
    });
  }

  const userToggle = document.getElementById('userToggle');
  const userMenu = document.querySelector('.user-menu');

  if(userToggle && userMenu){
    userToggle.addEventListener('click', function(event){
      event.preventDefault();
      userMenu.classList.toggle('open');
    });

    document.addEventListener('click', function(event){
      if(!userMenu.contains(event.target)){
        userMenu.classList.remove('open');
      }
    });
  }
});

(function(){
  const storageKey = 'studEvents.events.v1';
  const studentDirectory = [
    'Александра Иванова',
    'Михаил Петров',
    'Елизавета Розенко',
    'Даниил Смирнов',
    'Мария Кузнецова'
  ];

  let events = loadEvents();

  events.forEach(event => {
    const existingRoles = event.roles || event.studentsByRole || {};
    Object.values(existingRoles).flat().forEach(student => {
      if(student?.name && !studentDirectory.some(name => name.toLocaleLowerCase('ru') === student.name.trim().toLocaleLowerCase('ru'))){
        studentDirectory.push(student.name.trim());
      }
    });
  });

  const fallbackSettings = { weekStart: 'mon', timeFormat: '24', showTime: true, showPlace: true, hiddenTypes: [] };
  let settings = getSettings();
  let current = new Date();
  current = new Date(current.getFullYear(), current.getMonth(), 1);
  let calendarContainer = null;

  function loadEvents(){
    try{
      const storedEvents = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(storedEvents)
        ? storedEvents.map((event, index) => ({
          ...event,
          id: event.id || `calendar-${event.date || 'undated'}-${index + 1}`
        }))
        : [];
    }catch{
      return [];
    }
  }

  function formatDateKey(year, month, day){
    return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }

  function getTodayKey(){
    const today = new Date();
    return formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function persistEvents(){
    try{
      localStorage.setItem(storageKey, JSON.stringify(events));
      return true;
    }catch{
      return false;
    }
  }

  function getSettings(){
    return window.CalendarSettings ? window.CalendarSettings.load() : fallbackSettings;
  }

  function formatTime(time){
    const match = /^(\d{1,2}):(\d{2})/.exec(time || '');
    if(!match || settings.timeFormat !== '12') return time;
    const hours = Number(match[1]);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12 || 12}:${match[2]} ${suffix}`;
  }

  function capitalizeLabel(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function getEventTypeClass(type){
    return {
      'Научное': 'event-type-scientific',
      'Общественное': 'event-type-public',
      'Спортивное': 'event-type-sport',
      'Творческое': 'event-type-creative',
      'Городское': 'event-type-city'
    }[type] || '';
  }

  function createEventCard(event){
    const card = document.createElement('a');
    card.className = 'event-card';
    card.href = `./event.php?id=${encodeURIComponent(event.id)}`;
    card.setAttribute('aria-label', `Открыть мероприятие: ${event.title || 'Мероприятие'}`);
    card.dataset.eventId = event.id;

    if(event.date && event.date >= getTodayKey()){
      card.dataset.draggable = 'true';
    }

    if(event.type){
      card.dataset.eventType = event.type;
    }

    const title = document.createElement('h4');
    title.textContent = event.title || 'Мероприятие';
    card.appendChild(title);

    if(event.type){
      const type = document.createElement('span');
      type.className = `event-card-type ${getEventTypeClass(event.type)}`.trim();
      type.textContent = event.type;
      card.appendChild(type);
    }

    if(settings.showTime || settings.showPlace){
      const description = document.createElement('p');
      const eventDetails = [
        settings.showTime ? formatTime(event.time) : '',
        settings.showPlace ? event.location : ''
      ].filter(Boolean);

      description.textContent = eventDetails.join(' · ') || event.date;
      card.appendChild(description);
    }

    return card;
  }

  function buildMobileEventsList(year, month){
    const wrap = document.createElement('div');
    wrap.className = 'calendar-mobile-events';

    const monthEvents = events
      .filter(event => {
        if(!event.date) return false;
        if(settings.hiddenTypes.includes(event.type)) return false;

        const [y, m] = event.date.split('-').map(Number);
        return y === year && (m - 1) === month;
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    if(!monthEvents.length){
      const empty = document.createElement('div');
      empty.className = 'calendar-empty';
      empty.textContent = 'В этом месяце мероприятий нет';
      wrap.appendChild(empty);
      return wrap;
    }

    const byDate = new Map();

    monthEvents.forEach(event => {
      if(!byDate.has(event.date)) byDate.set(event.date, []);
      byDate.get(event.date).push(event);
    });

    [...byDate.keys()].sort().forEach(dateKey => {
      const dayBlock = document.createElement('div');
      dayBlock.className = 'calendar-mobile-day';
      dayBlock.dataset.date = dateKey;

      const header = document.createElement('div');
      header.className = 'calendar-mobile-day-date';

      const parsedDate = new Date(dateKey + 'T00:00:00');
      header.textContent = parsedDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'short'
      });

      dayBlock.appendChild(header);

      const list = document.createElement('div');
      list.className = 'calendar-mobile-day-events';

      byDate.get(dateKey).forEach(event => list.appendChild(createEventCard(event)));

      dayBlock.appendChild(list);
      wrap.appendChild(dayBlock);
    });

    return wrap;
  }

  function scrollToMobileDay(dateKey){
    if(!calendarContainer) return;

    const target = calendarContainer.querySelector(`.calendar-mobile-day[data-date="${dateKey}"]`);
    if(!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.add('is-highlighted');

    window.setTimeout(() => target.classList.remove('is-highlighted'), 1600);
  }

  function build(){
    if(!calendarContainer) return;

    settings = getSettings();
    calendarContainer.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'calendar-header';

    const title = document.createElement('div');
    title.className = 'calendar-title';
    title.textContent = capitalizeLabel(current.toLocaleString(undefined, {month: 'long', year: 'numeric'}));

    const nav = document.createElement('div');
    nav.className = 'calendar-nav';

    const prev = document.createElement('button');
    prev.textContent = '‹';
    prev.setAttribute('aria-label', 'Предыдущий месяц');

    const next = document.createElement('button');
    next.textContent = '›';
    next.setAttribute('aria-label', 'Следующий месяц');

    prev.addEventListener('click', () => {
      current = new Date(current.getFullYear(), current.getMonth()-1, 1);
      build();
    });

    next.addEventListener('click', () => {
      current = new Date(current.getFullYear(), current.getMonth()+1, 1);
      build();
    });

    nav.appendChild(prev);
    nav.appendChild(next);

    header.appendChild(title);
    header.appendChild(nav);
    calendarContainer.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    grid.dataset.weekStart = settings.weekStart === 'sun' ? 'sun' : 'mon';

    const weekStartsOnSunday = settings.weekStart === 'sun';
    const weekdays = weekStartsOnSunday
      ? ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
      : ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

    weekdays.forEach(day => {
      const w = document.createElement('div');
      w.className = 'calendar-weekday';
      w.textContent = day;
      grid.appendChild(w);
    });

    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1);
    const leading = weekStartsOnSunday ? firstDay.getDay() : (firstDay.getDay() + 6) % 7;
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

      const dateKey = formatDateKey(year, month, day);
      cell.dataset.date = dateKey;

      const dateSpan = document.createElement('div');
      dateSpan.className = 'date';
      dateSpan.textContent = day;

      const today = new Date();
      const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

      if(day === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
        cell.classList.add('today');
      }

      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.className = 'day-add-button';
      addButton.disabled = dateKey < todayKey;
      addButton.title = addButton.disabled
        ? 'Задним числом создать мероприятие может только администратор'
        : 'Создать событие';

      addButton.setAttribute('aria-label', addButton.title);

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

      const dayEvents = events.filter(event => event.date === dateKey && !settings.hiddenTypes.includes(event.type));

      if(dayEvents.length){
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'events';

        dayEvents.forEach(event => eventsContainer.appendChild(createEventCard(event)));

        cell.appendChild(eventsContainer);
      }

      cell.addEventListener('click', function(){
        if(!window.matchMedia('(max-width: 760px)').matches) return;
        scrollToMobileDay(dateKey);
      });

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
    calendarContainer.appendChild(buildMobileEventsList(year, month));
  }

  function openModal(dateValue){
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('eventModal');
    const dateInput = document.getElementById('eventDate');

    const today = new Date();
    const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

    dateInput.min = todayKey;

    const selectedDate = dateValue || todayKey;

    if(selectedDate < todayKey){
      window.showOperationFeedback?.('warning', 'Создать мероприятие задним числом может только администратор.');
      return;
    }

    resetModalForm();
    dateInput.value = selectedDate;

    overlay.classList.add('open');
    modal.classList.add('open');
  }

  function closeModal(){
    resetModalForm();
    document.getElementById('modalOverlay').classList.remove('open');
    document.getElementById('eventModal').classList.remove('open');
  }

  function resetModalForm(){
    const form = document.getElementById('eventForm');
    if(!form) return;

    form.reset();
    form.dispatchEvent(new CustomEvent('calendar:reset'));
  }

  function moveEvent(id, dateKey){
    const index = events.findIndex(event => event.id === id);
    if(index < 0) return false;

    const previous = events[index];
    if(previous.date === dateKey) return false;

    const moved = { ...previous, date: dateKey };
    if('dateISO' in previous) moved.dateISO = dateKey;

    events[index] = moved;

    if(!persistEvents()){
      events[index] = previous;
      window.showOperationFeedback?.('error', 'Не удалось сохранить перенос в этом браузере.');
      return false;
    }

    window.dispatchEvent(new CustomEvent('studEvents:updated'));
    build();

    const movedCard = calendarContainer.querySelector(`.calendar-day .event-card[data-event-id="${CSS.escape(id)}"]`);

    if(movedCard){
      movedCard.classList.add('just-moved');
      window.setTimeout(() => movedCard.classList.remove('just-moved'), 1000);
    }

    const label = new Date(dateKey + 'T00:00:00').toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });

    window.showOperationFeedback?.('success', `Мероприятие перенесено на ${label}.`);
    return true;
  }

  function setupDragAndDrop(){
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const moveThreshold = 6;
    const touchHoldDelay = 350;
    const scrollEdge = 70;

    let drag = null;
    let suppressClick = false;

    function findDropCell(x, y){
      const cell = document.elementFromPoint(x, y)?.closest('.calendar-day[data-date]');
      return cell && calendarContainer.contains(cell) ? cell : null;
    }

    function setDropTarget(cell){
      if(drag.cell === cell) return;

      drag.cell?.classList.remove('is-drop-target', 'is-drop-denied');
      drag.cell = cell;

      if(!cell) return;

      cell.classList.add(cell.dataset.date < getTodayKey() ? 'is-drop-denied' : 'is-drop-target');
    }

    function moveGhost(x, y){
      drag.ghost.style.transform = `translate3d(${x - drag.offsetX}px, ${y - drag.offsetY}px, 0) rotate(1.5deg)`;
    }

    function startDrag(x, y){
      window.clearTimeout(drag.holdTimer);

      const rect = drag.card.getBoundingClientRect();

      drag.active = true;
      drag.offsetX = x - rect.left;
      drag.offsetY = y - rect.top;

      const ghost = drag.card.cloneNode(true);
      ghost.removeAttribute('href');
      ghost.className = 'event-card event-card-ghost';
      ghost.style.width = `${rect.width}px`;

      calendarContainer.appendChild(ghost);

      drag.ghost = ghost;
      drag.card.classList.add('is-dragging');
      document.body.classList.add('calendar-dragging');

      moveGhost(x, y);
    }

    function cleanup(){
      if(!drag) return;

      window.clearTimeout(drag.holdTimer);

      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('keydown', onKeyDown);

      drag.ghost?.remove();
      drag.card.classList.remove('is-dragging');
      drag.cell?.classList.remove('is-drop-target', 'is-drop-denied');

      document.body.classList.remove('calendar-dragging');
      drag = null;
    }

    function endDrag(commit){
      if(!drag) return;

      const current = drag;
      const targetDate = current.cell?.dataset.date;

      cleanup();

      if(!current.active) return;

      suppressClick = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 80);

      if(!commit || !targetDate) return;

      if(targetDate < getTodayKey()){
        window.showOperationFeedback?.('warning', 'Перенести мероприятие на прошедшую дату может только администратор.');
        return;
      }

      moveEvent(current.id, targetDate);
    }

    function onPointerMove(event){
      if(!drag || event.pointerId !== drag.pointerId) return;

      if(!drag.active){
        const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);

        if(distance < moveThreshold) return;

        if(drag.pointerType === 'touch'){
          cleanup();
          return;
        }

        startDrag(event.clientX, event.clientY);
      }

      event.preventDefault();

      moveGhost(event.clientX, event.clientY);
      setDropTarget(findDropCell(event.clientX, event.clientY));

      if(event.clientY < scrollEdge){
        window.scrollBy(0, -(scrollEdge - event.clientY) / 4);
      }else if(event.clientY > window.innerHeight - scrollEdge){
        window.scrollBy(0, (event.clientY - (window.innerHeight - scrollEdge)) / 4);
      }
    }

    function onPointerUp(event){
      if(!drag || event.pointerId !== drag.pointerId) return;
      endDrag(true);
    }

    function onPointerCancel(event){
      if(!drag || event.pointerId !== drag.pointerId) return;
      endDrag(false);
    }

    function onKeyDown(event){
      if(event.key === 'Escape') endDrag(false);
    }

    calendarContainer.addEventListener('pointerdown', event => {
      if(drag || mobileQuery.matches) return;
      if(event.pointerType === 'mouse' && event.button !== 0) return;

      const card = event.target.closest('.calendar-day .event-card[data-draggable="true"]');
      if(!card || !calendarContainer.contains(card)) return;

      drag = {
        card,
        id: card.dataset.eventId,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startX: event.clientX,
        startY: event.clientY,
        active: false,
        cell: null,
        ghost: null,
        holdTimer: null
      };

      if(event.pointerType === 'touch'){
        const pending = drag;

        pending.holdTimer = window.setTimeout(() => {
          if(drag === pending) startDrag(pending.startX, pending.startY);
        }, touchHoldDelay);
      }

      document.addEventListener('pointermove', onPointerMove, { passive: false });
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerCancel);
      document.addEventListener('keydown', onKeyDown);
    });

    calendarContainer.addEventListener('dragstart', event => {
      if(event.target.closest?.('.event-card')) event.preventDefault();
    });

    calendarContainer.addEventListener('contextmenu', event => {
      if(drag) event.preventDefault();
    });

    calendarContainer.addEventListener('click', event => {
      if(!suppressClick) return;

      event.preventDefault();
      event.stopPropagation();
    }, true);

    document.addEventListener('touchmove', event => {
      if(drag?.active) event.preventDefault();
    }, { passive: false });
  }

  function init(selector){
    const el = document.querySelector(selector);
    if(!el) return;

    calendarContainer = el;
    build();
    setupDragAndDrop();
  }

  window.SimpleCalendar = {
    init,
    openModal,
    closeModal,

    getStudentDirectory(){
      return studentDirectory;
    },

    formatDateKey,
    moveEvent,

    addEvent(event){
      const savedEvent = {
        ...event,
        id: event.id || `calendar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      };

      events.push(savedEvent);

      if(!persistEvents()){
        events.pop();
        return null;
      }

      window.dispatchEvent(new CustomEvent('studEvents:updated'));
      build();

      return savedEvent;
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

  function setupDateInputIcon(){
    const dateInput = document.getElementById('eventDate');
    if(!dateInput) return;

    dateInput.classList.add('date-input-custom');
  }

  if(eventForm){
    const dateInput = document.getElementById('eventDate');
    const coverInput = document.getElementById('eventCover');
    const descriptionInput = document.getElementById('eventDescription');
    const descriptionHiddenInput = document.getElementById('eventDescriptionHidden');

    const coverPreview = document.getElementById('eventCoverPreview');
    const coverPreviewImage = document.getElementById('eventCoverPreviewImage');
    const coverPreviewName = document.getElementById('eventCoverPreviewName');

    const orderInput = document.getElementById('eventOrder');
    const orderPreview = document.getElementById('eventOrderPreview');
    const orderPreviewExt = document.getElementById('eventOrderPreviewExt');
    const orderPreviewName = document.getElementById('eventOrderPreviewName');
    const orderPreviewRemove = document.getElementById('eventOrderPreviewRemove');

    let coverData = '';
    let orderFileData = null;

    const rolePickers = new Map();
    const formatDateKey = SimpleCalendar.formatDateKey;

    const today = new Date();
    dateInput.min = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

    descriptionHiddenInput.addEventListener('change', () => {
      descriptionInput.disabled = descriptionHiddenInput.checked;
    });

    const studentDirectory = SimpleCalendar.getStudentDirectory();

    function formatOrderSize(bytes){
      if(bytes < 1024) return `${bytes} Б`;

      const kb = bytes / 1024;
      if(kb < 1024) return `${Math.round(kb)} КБ`;

      return `${(kb / 1024).toFixed(1).replace('.', ',')} МБ`;
    }

    function getOrderBadgeExt(filename){
      const parts = String(filename || '').split('.');
      const rawExt = parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';

      if(rawExt === 'DOC' || rawExt === 'DOCX' || rawExt === 'WORD') return 'W';

      return rawExt.slice(0, 4);
    }

    function resetOrderField(clearInput = true){
      orderFileData = null;

      if(clearInput && orderInput){
        orderInput.value = '';
      }

      if(orderPreview){
        orderPreview.hidden = true;
      }

      if(orderPreviewExt){
        orderPreviewExt.textContent = 'PDF';
      }

      if(orderPreviewName){
        orderPreviewName.textContent = '';
      }
    }

    function readFileAsDataURL(file){
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          resolve(String(reader.result || ''));
        });

        reader.addEventListener('error', () => {
          reject(new Error('Не удалось прочитать выбранный файл.'));
        });

        reader.readAsDataURL(file);
      });
    }

    function normalizeStudentName(name){
      return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru');
    }

    function updateStudentStatus(names, status, partial = false){
      status.className = 'student-directory-status';

      if(!names.length){
        status.textContent = 'Введите фамилию для поиска.';
        return;
      }

      const found = partial
        ? studentDirectory.filter(student => normalizeStudentName(student).includes(normalizeStudentName(names[0]))).slice(0, 6)
        : names.filter(name => studentDirectory.some(student => normalizeStudentName(student) === normalizeStudentName(name)));

      const missing = partial
        ? []
        : names.filter(name => !studentDirectory.some(student => normalizeStudentName(student) === normalizeStudentName(name)));

      if(partial && found.length){
        status.classList.add('student-directory-status-success');
        status.textContent = `Найдено совпадений: ${found.join(', ')}.`;
        return;
      }

      if(missing.length){
        status.classList.add('student-directory-status-warning');
        status.textContent = found.length
          ? `Найдено: ${found.join(', ')}. Не найдено в списке: ${missing.join(', ')}.`
          : `Не найдено в списке студентов: ${missing.join(', ')}.`;
      }else{
        status.classList.add('student-directory-status-success');
        status.textContent = `Найдено в списке: ${found.join(', ')}.`;
      }
    }

    function parseRoleNames(value){
      return value.split(/[\n,;]+/).map(name => name.trim()).filter(Boolean);
    }

    function makeStudent(name){
      return { name };
    }

    function setupRolePicker(role){
      const root = document.querySelector(`[data-calendar-role="${role}"]`);
      const search = root.querySelector('.calendar-student-search');
      const suggestions = root.querySelector('.calendar-student-suggestions');
      const selectedList = root.querySelector('.calendar-role-selected-list');
      const singleEntry = root.querySelector('.calendar-role-single-entry');
      const bulkMode = root.querySelector('.calendar-role-bulk-mode');
      const bulkInput = root.querySelector('.calendar-role-bulk');
      const status = root.querySelector('.student-directory-status');

      let selected = [];
      let mode = 'single';

      function renderSelected(){
        selectedList.replaceChildren();

        selected.forEach((student, index) => {
          const item = document.createElement('li');
          item.className = 'calendar-role-selected-item';

          const name = document.createElement('span');
          name.textContent = student.name;

          const remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'calendar-role-remove-student';
          remove.setAttribute('aria-label', `Убрать ${student.name}`);
          remove.textContent = '×';

          remove.addEventListener('click', () => {
            selected.splice(index, 1);
            renderSelected();
            updateStudentStatus(selected.map(person => person.name), status);
          });

          item.append(name, remove);
          selectedList.appendChild(item);
        });
      }

      function renderSuggestions(){
        const query = normalizeStudentName(search.value);
        suggestions.replaceChildren();

        if(!query){
          suggestions.hidden = true;
          updateStudentStatus(selected.map(person => person.name), status);
          return;
        }

        const matches = studentDirectory
          .filter(name => normalizeStudentName(name).includes(query))
          .filter(name => !selected.some(person => normalizeStudentName(person.name) === normalizeStudentName(name)))
          .slice(0, 6);

        if(matches.length){
          matches.forEach(name => {
            const option = document.createElement('button');
            option.className = 'calendar-student-suggestion';
            option.type = 'button';
            option.setAttribute('role', 'option');
            option.textContent = name;

            option.addEventListener('mousedown', event => event.preventDefault());

            option.addEventListener('click', () => {
              if(!selected.some(person => normalizeStudentName(person.name) === normalizeStudentName(name))){
                selected.push(makeStudent(name));
                renderSelected();
              }

              search.value = '';
              suggestions.hidden = true;
              updateStudentStatus(selected.map(person => person.name), status);
              search.focus();
            });

            suggestions.appendChild(option);
          });

          suggestions.hidden = false;
          updateStudentStatus([query], status, true);
        }else{
          const emptyOption = document.createElement('p');
          emptyOption.className = 'calendar-student-suggestions-empty';
          emptyOption.textContent = 'Совпадений нет';

          suggestions.appendChild(emptyOption);
          suggestions.hidden = false;

          status.className = 'student-directory-status student-directory-status-warning';
          status.textContent = 'Такого студента нет в текущем списке.';
        }
      }

      function addSearchMatch(){
        const query = normalizeStudentName(search.value);
        if(!query) return;

        const match = studentDirectory.find(name => {
          const normalizedName = normalizeStudentName(name);
          const surname = normalizedName.split(' ').at(-1);

          return normalizedName === query || surname === query;
        });

        if(!match) return;

        if(!selected.some(person => normalizeStudentName(person.name) === normalizeStudentName(match))){
          selected.push(makeStudent(match));
          renderSelected();
        }

        search.value = '';
        updateStudentStatus(selected.map(person => person.name), status);
      }

      search.addEventListener('input', renderSuggestions);
      search.addEventListener('change', addSearchMatch);

      search.addEventListener('blur', () => {
        window.setTimeout(() => {
          suggestions.hidden = true;
        }, 120);
      });

      search.addEventListener('keydown', event => {
        if(event.key === 'Enter'){
          event.preventDefault();
          addSearchMatch();
        }
      });

      bulkInput.addEventListener('input', () => {
        updateStudentStatus(parseRoleNames(bulkInput.value), status);
      });

      bulkMode.addEventListener('toggle', () => {
        if(bulkMode.open){
          mode = 'bulk';
          bulkInput.value = selected.map(person => person.name).join('\n');
          singleEntry.hidden = true;
          updateStudentStatus(parseRoleNames(bulkInput.value), status);
        }else if(mode === 'bulk'){
          mode = 'single';
          selected = parseRoleNames(bulkInput.value).map(makeStudent);
          singleEntry.hidden = false;
          renderSelected();
          updateStudentStatus(selected.map(person => person.name), status);
        }
      });

      root.getStudents = () => mode === 'bulk'
        ? parseRoleNames(bulkInput.value).map(makeStudent)
        : selected;

      root.resetPicker = () => {
        selected = [];
        mode = 'single';
        search.value = '';
        suggestions.hidden = true;
        bulkInput.value = '';
        bulkMode.open = false;
        singleEntry.hidden = false;
        renderSelected();
        updateStudentStatus([], status);
      };

      renderSelected();
      rolePickers.set(role, root);
    }

    ['organizers', 'volunteers', 'participants'].forEach(setupRolePicker);

    function resetDraft(){
      coverData = '';
      coverInput.value = '';
      coverPreview.hidden = true;
      coverPreviewImage.removeAttribute('src');
      coverPreviewName.textContent = '';

      resetOrderField();

      descriptionInput.disabled = false;

      rolePickers.forEach(picker => picker.resetPicker());

      document.getElementById('eventType').dispatchEvent(new Event('change', { bubbles: true }));
    }

    eventForm.addEventListener('calendar:reset', resetDraft);

    coverInput.addEventListener('change', () => {
      const file = coverInput.files[0];

      coverData = '';
      coverPreview.hidden = true;

      if(!file) return;

      if(!file.type.startsWith('image/')){
        coverInput.value = '';
        window.showOperationFeedback?.('warning', 'Выберите файл изображения.', document.getElementById('eventModal'));
        return;
      }

      if(file.size > 1.5 * 1024 * 1024){
        coverInput.value = '';
        window.showOperationFeedback?.('warning', 'Размер обложки должен быть не больше 1,5 МБ.', document.getElementById('eventModal'));
        return;
      }

      readFileAsDataURL(file).then(dataUrl => {
        if(coverInput.files?.[0] !== file) return;

        coverData = dataUrl;
        coverPreviewImage.src = coverData;
        coverPreviewName.textContent = file.name;
        coverPreview.hidden = false;
      }).catch(() => {
        window.showOperationFeedback?.('error', 'Не удалось прочитать изображение обложки.', document.getElementById('eventModal'));
      });
    });

    orderInput?.addEventListener('change', () => {
      const file = orderInput.files?.[0];

      resetOrderField(false);

      if(!file) return;

      const allowedExt = ['pdf', 'doc', 'docx'];
      const rawExt = file.name.split('.').pop()?.toLowerCase() || '';

      if(!allowedExt.includes(rawExt)){
        resetOrderField();
        window.showOperationFeedback?.('warning', 'Выберите файл приказа в формате PDF, DOC или DOCX.', document.getElementById('eventModal'));
        return;
      }

      if(file.size > 2.5 * 1024 * 1024){
        resetOrderField();
        window.showOperationFeedback?.('warning', 'Размер файла приказа должен быть не больше 2,5 МБ.', document.getElementById('eventModal'));
        return;
      }

      const extBadge = getOrderBadgeExt(file.name);
      const sizeStr = formatOrderSize(file.size);

      readFileAsDataURL(file).then(dataUrl => {
        if(orderInput.files?.[0] !== file) return;

        orderFileData = {
          name: file.name,
          size: sizeStr,
          ext: extBadge,
          url: dataUrl
        };

        if(orderPreviewExt) orderPreviewExt.textContent = extBadge;
        if(orderPreviewName) orderPreviewName.textContent = `${file.name} (${sizeStr})`;
        if(orderPreview) orderPreview.hidden = false;
      }).catch(() => {
        if(orderInput.files?.[0] === file){
          resetOrderField();
        }

        window.showOperationFeedback?.('error', 'Не удалось прочитать файл приказа.', document.getElementById('eventModal'));
      });
    });

    orderPreviewRemove?.addEventListener('click', resetOrderField);

    function saveEvent(eventData){
      const savedEvent = SimpleCalendar.addEvent(eventData);

      if(!savedEvent){
        window.showOperationFeedback?.('error', 'Не удалось сохранить мероприятие. Возможно, превышен лимит хранилища браузера. Попробуйте прикрепить файл меньшего размера.', document.getElementById('eventModal'));
        return false;
      }

      SimpleCalendar.closeModal();
      return true;
    }

    eventForm.addEventListener('submit', async function(event){
      event.preventDefault();

      if(eventForm.dataset.saving === 'true') return;

      const title = document.getElementById('eventTitle').value.trim();
      const type = document.getElementById('eventType').value;
      const level = document.getElementById('eventLevel').value;
      const date = document.getElementById('eventDate').value;
      const time = document.getElementById('eventTime').value;
      const location = document.getElementById('eventLocation').value.trim();
      const signer = document.getElementById('eventSigner').value.trim();
      const description = document.getElementById('eventDescription').value.trim();
      const descriptionHidden = document.getElementById('eventDescriptionHidden').checked;

      const currentDate = new Date();
      const todayKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

      if(date < todayKey){
        window.showOperationFeedback?.('warning', 'Создать мероприятие задним числом может только администратор.', document.getElementById('eventModal'));
        return;
      }

      eventForm.dataset.saving = 'true';

      try{
        const eventData = {
          title: title || 'Мероприятие',
          type,
          level,
          date,
          time,
          location,
          signer,
          cover: coverData,
          description,
          descriptionHidden,
          orderFile: orderFileData,
          roles: {
            organizers: rolePickers.get('organizers').getStudents(),
            volunteers: rolePickers.get('volunteers').getStudents(),
            participants: rolePickers.get('participants').getStudents()
          }
        };

        const coverFile = coverInput.files?.[0];

        if(coverFile && !eventData.cover){
          eventData.cover = await readFileAsDataURL(coverFile);
        }

        const orderFile = orderInput?.files?.[0];

        if(orderFile){
          const allowedExt = ['pdf', 'doc', 'docx'];
          const rawExt = orderFile.name.split('.').pop()?.toLowerCase() || '';

          if(!allowedExt.includes(rawExt)){
            window.showOperationFeedback?.('warning', 'Выберите файл приказа в формате PDF, DOC или DOCX.', document.getElementById('eventModal'));
            return;
          }

          if(orderFile.size > 2.5 * 1024 * 1024){
            window.showOperationFeedback?.('warning', 'Размер файла приказа должен быть не больше 2,5 МБ.', document.getElementById('eventModal'));
            return;
          }

          eventData.orderFile = {
            name: orderFile.name,
            size: formatOrderSize(orderFile.size),
            ext: getOrderBadgeExt(orderFile.name),
            url: await readFileAsDataURL(orderFile)
          };
        }

        saveEvent(eventData);
      }catch(error){
        window.showOperationFeedback?.('error', error?.message || 'Не удалось прочитать прикреплённый файл.', document.getElementById('eventModal'));
      }finally{
        delete eventForm.dataset.saving;
      }
    });
  }

  setupDateInputIcon();
});
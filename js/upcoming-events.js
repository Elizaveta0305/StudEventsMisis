(function(){
  const storageKey = 'studEvents.events.v1';

  function readEvents(){
    try{
      const events = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(events)
        ? events.map((event, index) => ({
          ...event,
          id: event.id || `calendar-${event.date || 'undated'}-${index + 1}`
        }))
        : [];
    }catch{
      return [];
    }
  }

  function formatDate(dateValue){
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  }

  function getUpcomingEvents(){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    const startKey = toDateKey(today);
    const endKey = toDateKey(end);

    return readEvents()
      .filter(event => typeof event.date === 'string' && event.date >= startKey && event.date < endKey)
      .sort((first, second) => first.date.localeCompare(second.date));
  }

  function toDateKey(date){
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function createEventItem(event){
    const item = document.createElement('a');
    item.className = 'upcoming-event-item';
    item.href = `./event.php?id=${encodeURIComponent(event.id)}`;
    item.setAttribute('aria-label', `Открыть мероприятие: ${event.title || 'Мероприятие'}`);

    const date = document.createElement('time');
    date.className = 'upcoming-event-date';
    date.dateTime = event.date;
    date.textContent = formatDate(event.date);

    const details = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'upcoming-event-title';
    title.textContent = event.title || 'Мероприятие';
    details.appendChild(title);

    const eventMeta = document.createElement('div');
    eventMeta.className = 'upcoming-event-meta';
    if(event.type){
      const type = document.createElement('span');
      type.className = `upcoming-event-type ${getEventTypeClass(event.type)}`.trim();
      type.textContent = event.type;
      eventMeta.appendChild(type);
    }
    if(event.level){
      const level = document.createElement('span');
      level.className = 'upcoming-event-level';
      level.textContent = event.level;
      eventMeta.appendChild(level);
    }
    if(eventMeta.childElementCount) details.appendChild(eventMeta);

    if(event.description){
      const description = document.createElement('p');
      description.className = 'upcoming-event-description';
      description.textContent = event.description;
      details.appendChild(description);
    }

    item.append(date, details);
    return item;
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

  function renderEvents(container){
    const fragment = document.createDocumentFragment();
    const events = getUpcomingEvents();

    if(!events.length){
      const empty = document.createElement('p');
      empty.className = 'upcoming-events-empty';
      empty.textContent = 'На ближайшую неделю мероприятий пока нет';
      fragment.appendChild(empty);
    }else{
      events.forEach(event => fragment.appendChild(createEventItem(event)));
    }

    container.replaceChildren(fragment);
  }

  document.addEventListener('DOMContentLoaded', function(){
    const trigger = document.getElementById('upcomingEventsTrigger');
    const overlay = document.getElementById('upcomingEventsOverlay');
    const modal = document.getElementById('upcomingEventsModal');
    const closeButton = document.getElementById('closeUpcomingEvents');
    const list = document.getElementById('upcomingEventsList');

    if(!trigger || !overlay || !modal || !closeButton || !list) return;

    let previouslyFocused = null;

    function closeModal(){
      overlay.classList.remove('open');
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', handleKeydown);
      previouslyFocused?.focus();
    }

    function handleKeydown(event){
      if(event.key === 'Escape') closeModal();
    }

    function openModal(event){
      event.preventDefault();
      previouslyFocused = document.activeElement;
      renderEvents(list);
      overlay.classList.add('open');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      closeButton.focus();
      document.addEventListener('keydown', handleKeydown);
    }

    trigger.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    window.addEventListener('storage', event => {
      if(event.key === storageKey && modal.classList.contains('open')) renderEvents(list);
    });
    window.addEventListener('studEvents:updated', () => {
      if(modal.classList.contains('open')) renderEvents(list);
    });
  });
})();
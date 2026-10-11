(function(){
  const storageKey = 'studEvents.events.v1';
  const roleLabels = {
    organizers: 'Организаторы',
    volunteers: 'Волонтёры',
    participants: 'Участники'
  };
  const roleAliases = {
    'Организаторы': 'organizers',
    'Волонтёры': 'volunteers',
    'Участники': 'participants'
  };
  const eventTypes = ['Научное', 'Общественное', 'Спортивное', 'Творческое'];
  const eventLevels = ['Университетский', 'Городской', 'Региональный', 'Межрегиональный', 'Всероссийский'];

  function getEventTypeClass(type){
    return {
      'Научное': 'event-type-scientific',
      'Общественное': 'event-type-public',
      'Спортивное': 'event-type-sport',
      'Творческое': 'event-type-creative',
      'Городское': 'event-type-city'
    }[type] || '';
  }

  function readEvents(){
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

  function formatDate(dateValue){
    if(!dateValue) return 'Не указана';
    const parts = dateValue.split('-').map(Number);
    if(parts.length !== 3 || parts.some(Number.isNaN)) return dateValue;
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function normalizeRoles(event){
    const source = event.roles || event.studentsByRole || event.students || {};
    if(Array.isArray(source)) return { organizers: [], volunteers: [], participants: [] };

    return Object.entries(source).reduce((roles, [key, people]) => {
      const role = roleLabels[key] ? key : roleAliases[key];
      if(role) roles[role] = Array.isArray(people) ? people : [];
      return roles;
    }, { organizers: [], volunteers: [], participants: [] });
  }

  function getDisplayDate(dateElement, event){
    return event.dateISO || event.date || dateElement.dataset.dateIso || '';
  }

  function renderPeople(roleElement, people){
    const list = roleElement.querySelector('[data-role-list]');
    const count = roleElement.querySelector('h3 span');
    list.replaceChildren();

    if(!Array.isArray(people) || people.length === 0){
      const empty = document.createElement('li');
      empty.className = 'event-role-empty';
      empty.textContent = 'Список пока не заполнен';
      list.appendChild(empty);
      count.textContent = '0';
      return;
    }

    people.forEach(person => {
      if(!person || typeof person !== 'object' || !person.name) return;
      const item = document.createElement('li');
      item.className = 'event-person';

      const initials = document.createElement('span');
      initials.className = 'event-person-avatar';
      initials.setAttribute('aria-hidden', 'true');
      initials.textContent = person.initials || person.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toLocaleUpperCase('ru');

      const details = document.createElement('span');
      details.className = 'event-person-details';
      const name = document.createElement('strong');
      name.textContent = person.name;
      const group = document.createElement('small');
      group.textContent = person.group || '';
      details.append(name, group);
      item.append(initials, details);
      list.appendChild(item);
    });

    count.textContent = String(list.children.length);
  }

  function createControl(field, value){
    const control = field === 'description' ? document.createElement('textarea') : document.createElement('input');
    control.className = 'event-inline-control';
    control.dataset.eventEditor = field;

    if(field === 'type' || field === 'level'){
      const select = document.createElement('select');
      select.className = control.className;
      select.dataset.eventEditor = field;
      const availableChoices = field === 'type' ? eventTypes : eventLevels;
      const choices = [...new Set([...availableChoices, value].filter(Boolean))];
      choices.forEach(choice => {
        const option = document.createElement('option');
        option.value = choice;
        option.textContent = choice;
        select.appendChild(option);
      });
      select.value = value;
      return select;
    }

    if(field === 'description'){
      control.rows = 4;
      control.value = value || '';
    }else{
      control.type = field === 'date' || field === 'time' ? field : 'text';
      control.value = value || '';
    }

    return control;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const documentCard = document.querySelector('#eventDocument');
    if(!documentCard) return;

    const eventId = documentCard.dataset.eventId;
    const initialDataElement = document.querySelector('#eventInitialData');
    let initialEvent = {};
    try{
      initialEvent = JSON.parse(initialDataElement?.textContent || '{}');
    }catch{
      initialEvent = {};
    }
    const storedEvent = readEvents().find(item => item.id === eventId);
    let currentEvent = {
      ...initialEvent,
      ...storedEvent,
      id: eventId,
      dateISO: storedEvent?.date || initialEvent.dateISO || ''
    };
    currentEvent.roles = normalizeRoles(storedEvent || initialEvent);
    const directoryElement = document.querySelector('#eventStudentDirectory');
    let studentDirectory = [];
    try{
      studentDirectory = JSON.parse(directoryElement?.textContent || '[]');
    }catch{
      studentDirectory = [];
    }
    readEvents().forEach(event => {
      Object.values(normalizeRoles(event)).flat().forEach(person => studentDirectory.push(person));
    });
    Object.values(currentEvent.roles).flat().forEach(person => studentDirectory.push(person));
    studentDirectory = Array.from(new Map(studentDirectory
      .filter(person => person?.name)
      .map(person => [person.name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru'), person])).values());

    const title = documentCard.querySelector('[data-event-title]');
    const type = documentCard.querySelector('[data-event-type]');
    const level = documentCard.querySelector('[data-event-level]');
    const date = documentCard.querySelector('[data-event-date]');
    const time = documentCard.querySelector('[data-event-time]');
    const location = documentCard.querySelector('[data-event-location]');
    const signer = documentCard.querySelector('[data-event-signer]');
    const description = documentCard.querySelector('[data-event-description]');
    const descriptionSection = documentCard.querySelector('[data-event-description-section]');
    const descriptionEditOption = documentCard.querySelector('[data-description-edit-option]');
    const descriptionHiddenInput = documentCard.querySelector('[data-description-hidden]');
    const editButton = document.querySelector('#eventEditButton');
    const saveButton = document.querySelector('#eventSaveButton');
    const cancelButton = document.querySelector('#eventCancelButton');
    const fields = {
      title: title,
      type: type,
      level: level,
      date: date,
      time: time,
      location: location,
      signer: signer,
      description: description
    };

    function renderEvent(event){
      title.textContent = event.title || 'Мероприятие';
      type.className = `event-document-type ${getEventTypeClass(event.type)}`.trim();
      type.textContent = event.type || 'Тип не указан';
      level.className = 'event-level-tag';
      level.textContent = event.level || 'Уровень не указан';
      date.textContent = formatDate(getDisplayDate(date, event));
      date.dataset.dateIso = getDisplayDate(date, event);
      time.textContent = event.time || 'Не указано';
      location.textContent = event.location || 'Не указано';
      signer.textContent = event.signer || 'Не указан';
      description.textContent = event.description || 'Описание пока не добавлено.';
      descriptionSection.hidden = Boolean(event.descriptionHidden);
      document.title = `${title.textContent} · Мероприятие`;

      const cover = documentCard.querySelector('[data-event-cover]');
      if(event.cover){
        const image = document.createElement('img');
        image.src = event.cover;
        image.alt = `Обложка: ${title.textContent}`;
        cover.replaceChildren(image);
      }else{
        const placeholder = document.createElement('div');
        placeholder.className = 'event-cover-placeholder';
        placeholder.setAttribute('role', 'img');
        placeholder.setAttribute('aria-label', 'Обложка мероприятия не добавлена');
        const placeholderText = document.createElement('span');
        placeholderText.textContent = 'Обложка мероприятия';
        placeholder.appendChild(placeholderText);
        cover.replaceChildren(placeholder);
      }

      documentCard.querySelectorAll('[data-event-role]').forEach(roleElement => {
        renderPeople(roleElement, event.roles?.[roleElement.dataset.eventRole]);
      });
    }

    function setEditing(isEditing){
      documentCard.classList.toggle('event-document-editing', isEditing);
      editButton.hidden = isEditing;
      saveButton.hidden = !isEditing;
      cancelButton.hidden = !isEditing;
      descriptionEditOption.hidden = !isEditing;

      if(!isEditing){
        documentCard.querySelectorAll('[data-role-editor]').forEach(editor => editor.remove());
        documentCard.querySelectorAll('[data-role-list]').forEach(list => list.hidden = false);
        renderEvent(currentEvent);
        return;
      }

      descriptionSection.hidden = false;
      descriptionHiddenInput.checked = Boolean(currentEvent.descriptionHidden);
      descriptionHiddenInput.addEventListener('change', () => {
        const editor = descriptionSection.querySelector('[data-event-editor="description"]');
        if(editor) editor.disabled = descriptionHiddenInput.checked;
      }, { once: true });

      const values = {
        title: currentEvent.title,
        type: currentEvent.type,
        level: currentEvent.level,
        date: getDisplayDate(date, currentEvent),
        time: currentEvent.time,
        location: currentEvent.location,
        signer: currentEvent.signer,
        description: currentEvent.description
      };

      Object.entries(fields).forEach(([field, element]) => {
        element.replaceChildren(createControl(field, values[field]));
      });
      type.classList.add('event-document-type-editing');
      level.classList.add('event-level-tag-editing');
      window.enhanceCustomSelect?.(documentCard.querySelector('[data-event-editor="type"]'));
      window.enhanceCustomSelect?.(documentCard.querySelector('[data-event-editor="level"]'));
      const descriptionControl = descriptionSection.querySelector('[data-event-editor="description"]');
      descriptionControl.disabled = descriptionHiddenInput.checked;

      documentCard.querySelectorAll('[data-event-role]').forEach(roleElement => {
        const list = roleElement.querySelector('[data-role-list]');
        const role = roleElement.dataset.eventRole;
        const editor = createRoleEditor(role, currentEvent.roles?.[role] || []);
        list.hidden = true;
        list.after(editor);
      });
    }

    function parsePeople(value){
      return value.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
        const [namePart, ...groupParts] = line.split('|');
        const name = namePart.trim();
        const group = groupParts.join('|').trim();
        return {
          name,
          group,
          initials: name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toLocaleUpperCase('ru')
        };
      });
    }

    function createRoleEditor(role, initialPeople){
      const editor = document.createElement('div');
      editor.className = 'event-role-editor';
      editor.dataset.roleEditor = role;

      const singleEntry = document.createElement('div');
      singleEntry.className = 'event-role-single-entry';
      const searchWrap = document.createElement('div');
      searchWrap.className = 'event-person-search-wrap';
      const search = document.createElement('input');
      search.className = 'event-person-search';
      search.type = 'search';
      search.autocomplete = 'off';
      search.placeholder = 'Начните вводить фамилию';
      search.setAttribute('role', 'combobox');
      search.setAttribute('aria-autocomplete', 'list');
      search.setAttribute('aria-expanded', 'false');
      search.setAttribute('aria-label', `Поиск: ${roleLabels[role]}`);
      const suggestions = document.createElement('div');
      suggestions.className = 'event-person-suggestions';
      suggestions.setAttribute('role', 'listbox');
      suggestions.hidden = true;
      searchWrap.append(search, suggestions);

      const selectedList = document.createElement('ul');
      selectedList.className = 'event-role-selected-list';
      selectedList.setAttribute('aria-label', `Выбранные: ${roleLabels[role]}`);
      singleEntry.append(searchWrap, selectedList);

      const bulkEntry = document.createElement('div');
      bulkEntry.className = 'event-role-bulk-entry';
      bulkEntry.hidden = true;
      const bulk = document.createElement('textarea');
      bulk.className = 'event-role-editor-textarea';
      bulk.rows = 4;
      bulk.placeholder = 'ФИО, по одному человеку на строку. Группу можно указать после символа |';
      bulk.setAttribute('aria-label', `Массовый ввод: ${roleLabels[role]}`);
      bulkEntry.appendChild(bulk);

      const footer = document.createElement('div');
      footer.className = 'event-role-editor-footer';
      const hint = document.createElement('small');
      hint.textContent = 'Выберите человека из списка совпадений.';
      const modeToggle = document.createElement('button');
      modeToggle.className = 'event-role-mode-toggle';
      modeToggle.type = 'button';
      modeToggle.textContent = 'Добавить списком';
      footer.append(hint, modeToggle);
      editor.append(singleEntry, bulkEntry, footer);

      let people = initialPeople.map(person => ({ ...person }));
      let mode = 'single';

      function renderSelected(){
        selectedList.replaceChildren();
        people.forEach((person, index) => {
          const item = document.createElement('li');
          item.className = 'event-role-selected-item';
          const label = document.createElement('span');
          label.textContent = `${person.name}${person.group ? ` · ${person.group}` : ''}`;
          const remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'event-role-remove-person';
          remove.setAttribute('aria-label', `Убрать ${person.name}`);
          remove.textContent = '×';
          remove.addEventListener('click', () => {
            people.splice(index, 1);
            renderSelected();
          });
          item.append(label, remove);
          selectedList.appendChild(item);
        });
      }

      function renderSuggestions(){
        const query = search.value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru');
        suggestions.replaceChildren();
        if(!query){
          suggestions.hidden = true;
          search.setAttribute('aria-expanded', 'false');
          return;
        }

        const matches = studentDirectory
          .filter(person => person.name.toLocaleLowerCase('ru').includes(query))
          .filter(person => !people.some(selected => selected.name.toLocaleLowerCase('ru') === person.name.toLocaleLowerCase('ru')))
          .slice(0, 6);

        if(!matches.length){
          const empty = document.createElement('p');
          empty.className = 'event-person-suggestions-empty';
          empty.textContent = 'Совпадений нет';
          suggestions.appendChild(empty);
        }else{
          matches.forEach(person => {
            const option = document.createElement('button');
            option.className = 'event-person-suggestion';
            option.type = 'button';
            option.setAttribute('role', 'option');
            const name = document.createElement('strong');
            name.textContent = person.name;
            const group = document.createElement('small');
            group.textContent = person.group || '';
            option.append(name, group);
            option.addEventListener('mousedown', event => event.preventDefault());
            option.addEventListener('click', () => {
              people.push({ ...person });
              search.value = '';
              renderSelected();
              renderSuggestions();
              search.focus();
            });
            suggestions.appendChild(option);
          });
        }

        suggestions.hidden = false;
        search.setAttribute('aria-expanded', 'true');
      }

      search.addEventListener('input', renderSuggestions);
      search.addEventListener('focus', renderSuggestions);
      search.addEventListener('blur', () => {
        window.setTimeout(() => {
          suggestions.hidden = true;
          search.setAttribute('aria-expanded', 'false');
        }, 120);
      });

      modeToggle.addEventListener('click', () => {
        if(mode === 'single'){
          mode = 'bulk';
          bulk.value = people.map(person => `${person.name}${person.group ? ` | ${person.group}` : ''}`).join('\n');
          singleEntry.hidden = true;
          bulkEntry.hidden = false;
          hint.textContent = 'Вводите по одному человеку на строку.';
          modeToggle.textContent = 'Выбрать по одному';
        }else{
          mode = 'single';
          people = parsePeople(bulk.value);
          singleEntry.hidden = false;
          bulkEntry.hidden = true;
          hint.textContent = 'Выберите человека из списка совпадений.';
          modeToggle.textContent = 'Добавить списком';
          renderSelected();
        }
      });

      renderSelected();
      editor.getPeople = () => mode === 'bulk' ? parsePeople(bulk.value) : people;
      return editor;
    }

    function saveEvent(){
      const controls = Object.fromEntries(Object.keys(fields).map(field => [field, documentCard.querySelector(`[data-event-editor="${field}"]`)]));
      const nextEvent = {
        ...currentEvent,
        id: eventId,
        title: controls.title.value.trim(),
        type: controls.type.value,
        level: controls.level.value,
        date: controls.date.value,
        dateISO: controls.date.value,
        time: controls.time.value,
        location: controls.location.value.trim(),
        signer: controls.signer.value.trim(),
        description: controls.description.value.trim(),
        descriptionHidden: descriptionHiddenInput.checked,
        roles: Object.fromEntries(Object.keys(roleLabels).map(role => [
          role,
          documentCard.querySelector(`[data-role-editor="${role}"]`).getPeople()
        ]))
      };

      if(!nextEvent.title || !nextEvent.type || !nextEvent.date){
        window.showOperationFeedback?.('error', 'Заполните название, тип и дату мероприятия.', documentCard);
        return;
      }

      try{
        const events = readEvents();
        const existingIndex = events.findIndex(item => item.id === eventId);
        if(existingIndex >= 0) events[existingIndex] = { ...events[existingIndex], ...nextEvent };
        else events.push(nextEvent);
        localStorage.setItem(storageKey, JSON.stringify(events));
        currentEvent = nextEvent;
        setEditing(false);
        window.showOperationFeedback?.('success', 'Изменения мероприятия сохранены.', documentCard);
      }catch{
        window.showOperationFeedback?.('error', 'Не удалось сохранить изменения в этом браузере.', documentCard);
      }
    }

    editButton.addEventListener('click', () => setEditing(true));
    cancelButton.addEventListener('click', () => setEditing(false));
    saveButton.addEventListener('click', saveEvent);
    renderEvent(currentEvent);
  });
})();
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
      'Творческое': 'event-type-creative'
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

  function formatFileSize(bytes){
    if(bytes < 1024) return `${bytes} Б`;
    const kb = bytes / 1024;
    if(kb < 1024) return `${Math.round(kb)} КБ`;
    return `${(kb / 1024).toFixed(1).replace('.', ',')} МБ`;
  }

  function getFileBadgeExt(filename){
    const parts = String(filename || '').split('.');
    const rawExt = parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
    if(rawExt === 'DOC' || rawExt === 'DOCX' || rawExt === 'WORD') return 'W';
    return rawExt.slice(0, 4);
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

  function buildMemoHtml(event){
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => (
      { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
    ));

    const roles = normalizeRoles(event);
    const peopleHtml = Object.entries(roleLabels).map(([key, label]) => {
      const list = (roles[key] || []).map(p =>
        `<li>${esc(p.name)}${p.group ? ' — ' + esc(p.group) : ''}</li>`
      ).join('');
      return `<h3>${label}</h3><ul>${list || '<li>—</li>'}</ul>`;
    }).join('');

    const dateText = event.dateISO ? formatDate(event.dateISO) : (event.date || '—');

    return `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                 xmlns:w="urn:schemas-microsoft-com:office:word"
                 xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Служебная записка</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; }
          h1 { text-align: center; font-size: 16pt; margin-bottom: 20pt; }
          h2 { font-size: 14pt; margin-top: 16pt; margin-bottom: 6pt; }
          h3 { font-size: 13pt; margin: 10pt 0 4pt; }
          p { margin: 4pt 0; }
          ul { margin: 4pt 0 10pt 20pt; padding: 0; }
        </style>
      </head>
      <body>
        <h1>СЛУЖЕБНАЯ ЗАПИСКА</h1>
        <p><b>Мероприятие:</b> ${esc(event.title || '—')}</p>
        <p><b>Тип:</b> ${esc(event.type || '—')}</p>
        <p><b>Уровень:</b> ${esc(event.level || '—')}</p>
        <p><b>Дата:</b> ${esc(dateText)}</p>
        <p><b>Время:</b> ${esc(event.time || '—')}</p>
        <p><b>Место проведения:</b> ${esc(event.location || '—')}</p>
        <p><b>Ответственный:</b> ${esc(event.signer || '—')}</p>
        <h2>Описание</h2>
        <p>${esc(event.description || '—')}</p>
        <h2>Команда мероприятия</h2>
        ${peopleHtml}
      </body>
    </html>`;
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

    const allStoredEvents = readEvents();
    let storedEvent = allStoredEvents.find(item => item.id === eventId);
    if(!storedEvent && initialEvent.title){
      storedEvent = allStoredEvents.find(item => item.title?.trim() === initialEvent.title.trim());
    }

    let currentEvent = {
      ...initialEvent,
      ...storedEvent,
      id: storedEvent?.id || eventId,
      dateISO: storedEvent?.date || initialEvent.dateISO || ''
    };
    currentEvent.roles = normalizeRoles(storedEvent || initialEvent);
    currentEvent.orderFile = storedEvent?.orderFile !== undefined
      ? storedEvent.orderFile
      : (initialEvent.orderFile || null);

    const directoryElement = document.querySelector('#eventStudentDirectory');
    let studentDirectory = [];
    try{
      studentDirectory = JSON.parse(directoryElement?.textContent || '[]');
    }catch{
      studentDirectory = [];
    }
    allStoredEvents.forEach(event => {
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

    const memoNameEl = documentCard.querySelector('[data-event-memo-name]');
    const memoMetaEl = documentCard.querySelector('[data-event-memo-meta]');
    const memoDownloadEl = documentCard.querySelector('[data-event-memo-download]');

    const orderCard = documentCard.querySelector('[data-event-order-card]');
    const orderExtEl = orderCard?.querySelector('[data-event-order-ext]');
    const orderNameEl = orderCard?.querySelector('[data-event-order-name]');
    const orderMetaEl = orderCard?.querySelector('[data-event-order-meta]');
    const orderDownloadEl = orderCard?.querySelector('[data-event-order-download]');
    const orderEditActions = orderCard?.querySelector('[data-order-edit-actions]');
    const orderInput = orderCard?.querySelector('[data-event-order-input]');
    const orderBtnText = orderCard?.querySelector('[data-event-order-btn-text]');
    const orderRemoveBtn = orderCard?.querySelector('[data-event-order-remove]');

    let draftOrderFile = null;

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

    function renderMemoName(eventTitle){
      const cleanTitle = (eventTitle || 'Мероприятие').trim();
      const memoFileName = `Служебная записка — ${cleanTitle}.doc`;
      if(memoNameEl) memoNameEl.textContent = memoFileName;
      if(memoDownloadEl) memoDownloadEl.setAttribute('download', memoFileName);
    }

    function renderOrderCard(orderFile, isEditing){
      if(!orderCard) return;

      if(!orderFile && !isEditing){
        orderCard.hidden = true;
        return;
      }

      orderCard.hidden = false;

      if(orderFile){
        if(orderExtEl) orderExtEl.textContent = orderFile.ext || getFileBadgeExt(orderFile.name);
        if(orderNameEl) orderNameEl.textContent = orderFile.name;
        if(orderMetaEl){
          const status = isEditing && orderFile.isDraft
            ? 'Новый приказ (сохраните изменения)'
            : 'Приказ о мероприятии · Доступен для скачивания';
          orderMetaEl.textContent = `${orderFile.size || ''} · ${status}`.replace(/^ · /, '');
        }
        if(orderDownloadEl){
          orderDownloadEl.href = orderFile.url || '#';
          orderDownloadEl.setAttribute('download', orderFile.name);
          orderDownloadEl.hidden = isEditing;
        }
        if(orderBtnText) orderBtnText.textContent = 'Заменить приказ';
        if(orderRemoveBtn) orderRemoveBtn.hidden = false;
      }else{
        if(orderExtEl) orderExtEl.textContent = '—';
        if(orderNameEl) orderNameEl.textContent = 'Приказ не прикреплён';
        if(orderMetaEl) orderMetaEl.textContent = 'Прикрепите файл приказа (PDF, DOC, DOCX), если он требуется';
        if(orderDownloadEl) orderDownloadEl.hidden = true;
        if(orderBtnText) orderBtnText.textContent = 'Загрузить приказ';
        if(orderRemoveBtn) orderRemoveBtn.hidden = true;
      }

      if(orderEditActions){
        orderEditActions.hidden = !isEditing;
      }
    }

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

      renderMemoName(event.title);
      if(memoMetaEl){
        memoMetaEl.textContent = 'Служебная записка · Формируется автоматически из данных мероприятия';
      }
      if(memoDownloadEl){
        memoDownloadEl.hidden = false;
      }

      renderOrderCard(event.orderFile, false);
    }

    function setEditing(isEditing){
      documentCard.classList.toggle('event-document-editing', isEditing);
      editButton.hidden = isEditing;
      saveButton.hidden = !isEditing;
      cancelButton.hidden = !isEditing;
      descriptionEditOption.hidden = !isEditing;

      if(!isEditing){
        if(orderInput) orderInput.value = '';
        draftOrderFile = null;
        documentCard.querySelectorAll('[data-role-editor]').forEach(editor => editor.remove());
        documentCard.querySelectorAll('[data-role-list]').forEach(list => list.hidden = false);
        renderEvent(currentEvent);
        return;
      }

      draftOrderFile = currentEvent.orderFile ? { ...currentEvent.orderFile, isDraft: false } : null;

      renderMemoName(currentEvent.title);
      if(memoMetaEl){
        memoMetaEl.textContent = 'Служебная записка · Обновится автоматически при сохранении изменений';
      }
      if(memoDownloadEl){
        memoDownloadEl.hidden = false;
      }
      renderOrderCard(draftOrderFile, true);

      descriptionSection.hidden = false;
      descriptionHiddenInput.checked = Boolean(currentEvent.descriptionHidden);
      descriptionHiddenInput.onchange = () => {
        const editor = descriptionSection.querySelector('[data-event-editor="description"]');
        if(editor) editor.disabled = descriptionHiddenInput.checked;
      };

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

      const titleControl = documentCard.querySelector('[data-event-editor="title"]');
      titleControl?.addEventListener('input', () => {
        renderMemoName(titleControl.value);
      });

      documentCard.querySelectorAll('[data-event-role]').forEach(roleElement => {
        const list = roleElement.querySelector('[data-role-list]');
        const role = roleElement.dataset.eventRole;
        const editor = createRoleEditor(role, currentEvent.roles?.[role] || []);
        list.hidden = true;
        list.after(editor);
      });
    }

    memoDownloadEl?.addEventListener('click', (e) => {
      e.preventDefault();

      const filename = `Служебная записка — ${(currentEvent.title || 'Мероприятие').trim()}.doc`;
      const blob = new Blob(['\ufeff', buildMemoHtml(currentEvent)], {
        type: 'application/msword;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    orderInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if(!file) return;

      const ext = getFileBadgeExt(file.name);
      const sizeStr = formatFileSize(file.size);

      const applyOrderDraft = (urlValue) => {
        draftOrderFile = {
          name: file.name,
          size: sizeStr,
          ext: ext,
          url: urlValue,
          isDraft: true
        };
        renderOrderCard(draftOrderFile, true);
      };

      if(file.size <= 2.5 * 1024 * 1024){
        const reader = new FileReader();
        reader.onload = () => applyOrderDraft(String(reader.result));
        reader.onerror = () => applyOrderDraft(URL.createObjectURL(file));
        reader.readAsDataURL(file);
      }else{
        applyOrderDraft(URL.createObjectURL(file));
      }
    });

    orderRemoveBtn?.addEventListener('click', () => {
      if(orderInput) orderInput.value = '';
      draftOrderFile = null;
      renderOrderCard(null, true);
    });

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
      const nextTitle = controls.title.value.trim();

      let finalOrderFile = draftOrderFile ? { ...draftOrderFile } : null;
      if(finalOrderFile) delete finalOrderFile.isDraft;

      const nextEvent = {
        ...currentEvent,
        id: currentEvent.id || eventId,
        title: nextTitle,
        type: controls.type.value,
        level: controls.level.value,
        date: controls.date.value,
        dateISO: controls.date.value,
        time: controls.time.value,
        location: controls.location.value.trim(),
        signer: controls.signer.value.trim(),
        description: controls.description.value.trim(),
        descriptionHidden: descriptionHiddenInput.checked,
        orderFile: finalOrderFile,
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
        const existingIndex = events.findIndex(item => item.id === nextEvent.id);
        if(existingIndex >= 0) events[existingIndex] = { ...events[existingIndex], ...nextEvent };
        else events.push(nextEvent);

        try {
          localStorage.setItem(storageKey, JSON.stringify(events));
        } catch {
          if(nextEvent.orderFile?.url?.startsWith('data:')){
            nextEvent.orderFile = { ...nextEvent.orderFile, url: '#' };
            if(existingIndex >= 0) events[existingIndex] = { ...events[existingIndex], ...nextEvent };
            localStorage.setItem(storageKey, JSON.stringify(events));
          } else {
            throw new Error('Storage quota exceeded');
          }
        }

        currentEvent = nextEvent;
        setEditing(false);
        window.showOperationFeedback?.('success', 'Изменения сохранены. Служебная записка обновлена.', documentCard);
      }catch{
        window.showOperationFeedback?.('error', 'Не удалось сохранить изменения в этом браузере.', documentCard);
      }
    }

    if(editButton && cancelButton && saveButton){
        editButton.addEventListener('click', () => setEditing(true));
        cancelButton.addEventListener('click', () => setEditing(false));
        saveButton.addEventListener('click', saveEvent);
    }
    renderEvent(currentEvent);
  });
})();
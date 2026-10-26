(function(){
  'use strict';

  const STORAGE_KEY = 'studEvents.events.v1';
  const ROLE_KEYS = ['organizers', 'volunteers', 'participants'];
  const ROLE_ALIASES = {
    'Организаторы': 'organizers',
    'Волонтёры': 'volunteers',
    'Участники': 'participants'
  };
  const MAX_ORDER_SIZE = 2.5 * 1024 * 1024;
  const MAX_COVER_SIZE = 1.5 * 1024 * 1024;

  const DEFAULT_STUDENTS = [
    { name: 'Александра Иванова', group: 'ИТ-23' },
    { name: 'Михаил Петров', group: 'ИТ-22' },
    { name: 'Елизавета Розенко', group: 'ИТ-23' },
    { name: 'Даниил Смирнов', group: 'Э/Ц-24' },
    { name: 'Мария Кузнецова', group: 'ИТ-23' }
  ];

  const DEFAULT_STAFF = [
    { name: 'Анна Михайловна Мартынова', department: 'УВР' },
    { name: 'Наталья Анатольевна Полева', department: 'ИЭФ' },
    { name: 'Ольга Александровна Верзилина', department: 'ИЭФ' },
    { name: 'Антон Юрьевич Соловьев', department: 'ФАИТ' },
    { name: 'Нелли Игоревна Ковтун', department: 'ФАИТ' }
  ];

  const DEMO_EVENTS = [
    {
      id: 'event-1',
      title: 'Хахакмекфест 2027',
      type: 'Научное',
      level: 'Всероссийский',
      date: '2027-08-12',
      time: '14:00',
      location: 'Главный корпус МИСИС',
      signer: 'Анна Михайловна Мартынова',
      description: 'Хакатон для студентов и школьников. Участники объединяются в команды, чтобы за один день разработать и представить собственные проекты.',
      roles: {
        organizers: [{ name: 'Елизавета Розенко', group: 'ИТ-23' }],
        volunteers: [{ name: 'Александра Иванова', group: 'ИТ-23' }, { name: 'Даниил Смирнов', group: 'Э/Ц-24' }],
        participants: [{ name: 'Михаил Петров', group: 'ИТ-22' }, { name: 'Мария Кузнецова', group: 'ИТ-23' }]
      },
      staff: [{ name: 'Анна Михайловна Мартынова', department: 'УВР' }]
    },
    {
      id: 'event-2',
      title: 'День открытых дверей',
      type: 'Общественное',
      level: 'Университетский',
      date: '2026-09-01',
      time: '10:00',
      location: 'Главный корпус МИСИС',
      signer: 'Наталья Викторовна Петрова',
      description: 'Знакомство абитуриентов с университетом, образовательными программами и студенческой жизнью.',
      roles: {
        organizers: [{ name: 'Михаил Петров', group: 'ИТ-22' }],
        volunteers: [{ name: 'Елизавета Розенко', group: 'ИТ-23' }],
        participants: [{ name: 'Александра Иванова', group: 'ИТ-23' }, { name: 'Мария Кузнецова', group: 'ИТ-23' }]
      },
      staff: [{ name: 'Наталья Викторовна Петрова', department: 'ИЭФ' }, { name: 'Анатолий Иванович', department: 'ФММТ' }]
    },
    {
      id: 'event-3',
      title: 'Погружение 2026',
      type: 'Университетское',
      level: 'Городской',
      date: '2026-08-25',
      time: '16:30',
      location: 'Университетский кампус',
      signer: 'Ольга Александровна Иванова',
      description: 'Встреча для знакомства и сплочения студентов. В программе командные задания, экскурсия по кампусу и общение.',
      roles: {
        organizers: [{ name: 'Даниил Смирнов', group: 'Э/Ц-24' }],
        volunteers: [{ name: 'Мария Кузнецова', group: 'ИТ-23' }, { name: 'Александра Иванова', group: 'ИТ-23' }],
        participants: [{ name: 'Елизавета Розенко', group: 'ИТ-23' }, { name: 'Михаил Петров', group: 'ИТ-22' }]
      },
      staff: [{ name: 'Ольга Александровна Иванова', department: 'ИЭФ' }]
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);

  function el(tag, className, text){
    const node = document.createElement(tag);
    if(className) node.className = className;
    if(text !== undefined) node.textContent = text;
    return node;
  }

  function normalizeName(name){
    return String(name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru');
  }

  function formatDateKey(date){
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function todayKey(){
    return formatDateKey(new Date());
  }

  function parseDate(isoDate){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate || ''))) return null;
    const date = new Date(`${isoDate}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatLongDate(isoDate){
    const date = parseDate(isoDate);
    return date ? date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'без даты';
  }

  function plural(count, one, few, many){
    const mod10 = count % 10;
    const mod100 = count % 100;
    if(mod10 === 1 && mod100 !== 11) return one;
    if(mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  function formatSize(bytes){
    if(bytes < 1024) return `${bytes} Б`;
    if(bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
    return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} МБ`;
  }

  function notify(type, message, target){
    window.showOperationFeedback?.(type, message, target);
  }

  function readEvents(){
    try{
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(stored)
        ? stored.map((event, index) => ({
          ...event,
          id: event.id || `calendar-${event.date || 'undated'}-${index + 1}`
        }))
        : [];
    }catch{
      return [];
    }
  }

  function writeEvents(events){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    }catch{
      return false;
    }
  }

  function announceChange(){
    window.dispatchEvent(new CustomEvent('studEvents:updated'));
  }

  function getRoles(event){
    const source = event.roles || event.studentsByRole || event.students || {};
    const roles = { organizers: [], volunteers: [], participants: [] };
    if(!source || Array.isArray(source)) return roles;

    Object.entries(source).forEach(([key, people]) => {
      const role = ROLE_KEYS.includes(key) ? key : ROLE_ALIASES[key];
      if(role && Array.isArray(people)) roles[role] = people.filter(person => person && person.name);
    });

    return roles;
  }

  function toPerson(value){
    if(typeof value === 'string') return { name: value.trim() };
    const person = { name: String(value?.name || '').trim() };
    if(value?.group) person.group = value.group;
    if(value?.department) person.department = value.department;
    return person;
  }

  function buildDirectory(events){
    const students = new Map();
    const staff = new Map();

    function addStudent(value){
      const person = toPerson(value);
      if(!person.name) return;
      const key = normalizeName(person.name);
      const existing = students.get(key);
      if(!existing || (!existing.group && person.group)) students.set(key, { name: person.name, group: person.group || '' });
    }

    function addStaff(value){
      const person = toPerson(value);
      if(!person.name) return;
      const key = normalizeName(person.name);
      const existing = staff.get(key);
      if(!existing || (!existing.department && person.department)) staff.set(key, { name: person.name, department: person.department || '' });
    }

    DEFAULT_STUDENTS.forEach(addStudent);
    DEFAULT_STAFF.forEach(addStaff);

    events.forEach(event => {
      Object.values(getRoles(event)).flat().forEach(addStudent);
      (Array.isArray(event.staff) ? event.staff : []).forEach(addStaff);
    });

    const byName = (a, b) => a.name.localeCompare(b.name, 'ru');
    return { students: [...students.values()].sort(byName), staff: [...staff.values()].sort(byName) };
  }

  function readFileAsDataUrl(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(String(reader.result || '')));
      reader.addEventListener('error', () => reject(new Error('Не удалось прочитать файл.')));
      reader.readAsDataURL(file);
    });
  }

  function extOf(filename){
    const parts = String(filename || '').split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  }

  function badgeExt(filename){
    const ext = extOf(filename).toUpperCase();
    if(ext === 'DOC' || ext === 'DOCX') return 'W';
    return ext.slice(0, 4) || 'FILE';
  }

  function createPeoplePicker(root, config){
    const listId = `${config.id}Options`;

    const anchor = el('div', 'admin-picker-anchor');
    const control = el('div', 'admin-picker-control');

    const search = el('input', 'admin-picker-search');
    search.type = 'search';
    search.placeholder = config.placeholder;
    search.autocomplete = 'off';
    search.setAttribute('role', 'combobox');
    search.setAttribute('aria-autocomplete', 'list');
    search.setAttribute('aria-expanded', 'false');
    search.setAttribute('aria-controls', listId);
    if(config.labelId) search.setAttribute('aria-labelledby', config.labelId);

    const toggle = el('button', 'admin-picker-toggle');
    toggle.type = 'button';
    toggle.tabIndex = -1;
    toggle.setAttribute('aria-label', 'Открыть список');
    const arrow = el('span');
    arrow.setAttribute('aria-hidden', 'true');
    toggle.appendChild(arrow);

    control.append(search, toggle);

    const menu = el('div', 'admin-picker-menu');
    menu.hidden = true;

    const list = el('div', 'admin-picker-list');
    list.id = listId;
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-multiselectable', 'true');

    const empty = el('p', 'admin-picker-empty', 'Ничего не найдено');
    empty.hidden = true;

    menu.append(list, empty);
    anchor.append(control, menu);

    const chips = el('div', 'admin-picker-selected');
    chips.hidden = true;
    chips.setAttribute('aria-live', 'polite');

    root.classList.add('admin-people-picker');
    root.replaceChildren(anchor, chips);

    let selected = [];

    function sublabel(person){
      return person.group || person.department || '';
    }

    function isSelected(person){
      return selected.some(item => normalizeName(item.name) === normalizeName(person.name));
    }

    function setOpen(open){
      menu.hidden = !open;
      root.classList.toggle('is-open', open);
      search.setAttribute('aria-expanded', String(open));
    }

    function visibleOptions(){
      return Array.from(list.querySelectorAll('.admin-picker-option'));
    }

    function renderChips(){
      chips.replaceChildren();

      selected.forEach(person => {
        const chip = el('span', 'admin-picker-chip');
        chip.appendChild(el('span', '', person.name));
        if(sublabel(person)) chip.appendChild(el('small', 'admin-picker-chip-sub', sublabel(person)));

        const remove = el('button', 'admin-picker-chip-remove');
        remove.type = 'button';
        remove.setAttribute('aria-label', `Убрать: ${person.name}`);
        remove.innerHTML = '<span aria-hidden="true">&times;</span>';
        remove.addEventListener('click', () => {
          selected = selected.filter(item => normalizeName(item.name) !== normalizeName(person.name));
          renderChips();
          if(!menu.hidden) renderOptions();
          search.focus();
        });

        chip.appendChild(remove);
        chips.appendChild(chip);
      });

      chips.hidden = selected.length === 0;
    }

    function toggleSelection(person){
      if(isSelected(person)) selected = selected.filter(item => normalizeName(item.name) !== normalizeName(person.name));
      else selected.push({ ...person });

      renderChips();
      renderOptions();
      search.focus();
    }

    function renderOptions(){
      const query = normalizeName(search.value);
      list.replaceChildren();
      let count = 0;

      config.getDirectory().forEach(person => {
        const haystack = normalizeName(`${person.name} ${sublabel(person)}`);
        if(query && !haystack.includes(query)) return;
        count++;

        const option = el('button', 'admin-picker-option', sublabel(person) ? `${person.name} · ${sublabel(person)}` : person.name);
        option.type = 'button';
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', String(isSelected(person)));
        option.addEventListener('click', () => toggleSelection(person));
        option.addEventListener('keydown', event => {
          const options = visibleOptions();
          const index = options.indexOf(option);

          if(event.key === 'Escape'){
            event.preventDefault();
            setOpen(false);
            search.focus();
          }else if(event.key === 'ArrowDown' || event.key === 'ArrowUp'){
            event.preventDefault();
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            options[(index + direction + options.length) % options.length]?.focus();
          }else if(event.key === 'Home'){
            event.preventDefault();
            options[0]?.focus();
          }else if(event.key === 'End'){
            event.preventDefault();
            options[options.length - 1]?.focus();
          }
        });

        list.appendChild(option);
      });

      empty.hidden = count > 0;
      setOpen(true);
    }

    search.addEventListener('focus', renderOptions);
    search.addEventListener('input', renderOptions);
    search.addEventListener('keydown', event => {
      if(event.key === 'Escape' && !menu.hidden){
        event.preventDefault();
        setOpen(false);
      }else if(event.key === 'ArrowDown' || event.key === 'ArrowUp'){
        event.preventDefault();
        renderOptions();
        const options = visibleOptions();
        (event.key === 'ArrowDown' ? options[0] : options[options.length - 1])?.focus();
      }else if(event.key === 'Enter'){
        event.preventDefault();
        const options = visibleOptions();
        if(search.value.trim() && options.length === 1) options[0].click();
      }else if(event.key === 'Backspace' && !search.value && selected.length){
        selected.pop();
        renderChips();
        if(!menu.hidden) renderOptions();
      }
    });

    toggle.addEventListener('click', () => {
      if(menu.hidden){
        renderOptions();
        search.focus();
      }else{
        setOpen(false);
      }
    });

    document.addEventListener('click', event => {
      if(!root.contains(event.target)) setOpen(false);
    });

    root.picker = {
      getValues(){
        return selected.map(person => ({ ...person }));
      },
      setValues(values){
        selected = (values || []).map(toPerson).filter(person => person.name);
        search.value = '';
        setOpen(false);
        renderChips();
      },
      clear(){
        this.setValues([]);
      }
    };

    return root.picker;
  }

  function initializeEvents(){
    const section = $('#events');
    const form = $('#adminEventForm');
    if(!section || !form) return;

    const listElement = $('#adminEventList');
    const summary = $('#adminEventsSummary');
    const emptyBox = $('#adminEventsEmpty');
    const emptyTitle = $('#adminEmptyTitle');
    const emptyText = $('#adminEmptyText');
    const emptyActions = $('#adminEmptyActions');
    const searchInput = $('#adminEventSearch');
    const typeFilter = $('#adminEventTypeFilter');
    const periodButtons = Array.from(section.querySelectorAll('[data-period]'));
    const createButton = $('#adminCreateEvent');

    const drawer = $('#adminDrawer');
    const overlay = $('#adminDrawerOverlay');
    const drawerKicker = $('#adminDrawerKicker');
    const drawerTitle = $('#adminDrawerTitle');
    const closeButton = $('#adminDrawerClose');
    const cancelButton = $('#adminDrawerCancel');
    const deleteButton = $('#adminDrawerDelete');
    const submitButton = $('#adminEventSubmit');
    const status = $('#adminEventStatus');
    const dateHint = $('#adminDateHint');
    const signerList = $('#adminSignerList');

    const fields = {
      title: form.elements.namedItem('event_title'),
      type: form.elements.namedItem('event_type'),
      level: form.elements.namedItem('event_level'),
      date: form.elements.namedItem('event_date'),
      time: form.elements.namedItem('event_time'),
      location: form.elements.namedItem('event_location'),
      signer: form.elements.namedItem('event_signer'),
      description: form.elements.namedItem('event_description'),
      descriptionHidden: form.elements.namedItem('event_description_hidden')
    };

    const orderInput = $('#adminEventOrder');
    const orderChip = $('#adminOrderChip');
    const orderExt = $('#adminOrderExt');
    const orderName = $('#adminOrderName');
    const orderRemove = $('#adminOrderRemove');
    const orderHint = $('#adminOrderHint');
    const coverInput = $('#adminEventCover');
    const coverPreview = $('#adminCoverPreview');
    const coverImage = $('#adminCoverPreviewImage');
    const coverRemove = $('#adminRemoveCover');
    const coverHint = $('#adminCoverHint');

    const state = { query: '', type: '', period: 'upcoming' };
    let directory = buildDirectory(readEvents());
    let editingId = null;
    let baseline = '';
    let isOpen = false;
    let lastFocus = null;
    let pendingReads = 0;
    let highlightId = '';
    let highlightTimer = 0;

    const files = {
      order: { current: null, draft: null, removed: false },
      cover: { current: '', draft: '', removed: false }
    };

    const pickers = {};
    document.querySelectorAll('[data-people-role]').forEach(root => {
      const role = root.dataset.peopleRole;
      pickers[role] = createPeoplePicker(root, {
        id: `adminPicker-${role}`,
        labelId: root.dataset.labelId,
        placeholder: root.dataset.placeholder,
        getDirectory: () => role === 'staff' ? directory.staff : directory.students
      });
    });

    function refreshDirectory(){
      const events = readEvents();
      directory = buildDirectory(events);

      const names = new Set(directory.staff.map(person => person.name));
      events.forEach(event => {
        if(event.signer) names.add(event.signer);
      });

      signerList.replaceChildren();
      Array.from(names).sort((a, b) => a.localeCompare(b, 'ru')).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        signerList.appendChild(option);
      });
    }

    function effectiveOrder(){
      if(files.order.removed) return null;
      return files.order.draft || files.order.current;
    }

    function effectiveCover(){
      if(files.cover.removed) return '';
      return files.cover.draft || files.cover.current;
    }

    function renderOrder(){
      const order = effectiveOrder();
      orderChip.hidden = !order;

      if(order){
        orderExt.textContent = order.ext || badgeExt(order.name);
        orderName.textContent = order.size ? `${order.name} (${order.size})` : order.name;
        orderHint.textContent = files.order.draft
          ? 'Новый файл заменит текущий после сохранения.'
          : 'Текущий документ мероприятия. Выберите другой файл, чтобы заменить его.';
      }else{
        orderName.textContent = '';
        orderHint.textContent = files.order.removed
          ? 'Документ будет удалён после сохранения.'
          : 'PDF, DOC или DOCX, не больше 2,5 МБ.';
      }
    }

    function renderCover(){
      const cover = effectiveCover();
      coverPreview.hidden = !cover;

      if(cover) coverImage.src = cover;
      else coverImage.removeAttribute('src');

      if(cover){
        coverHint.textContent = files.cover.draft
          ? 'Новая обложка заменит текущую после сохранения.'
          : 'Текущая обложка. Выберите другое изображение, чтобы заменить её.';
      }else{
        coverHint.textContent = files.cover.removed
          ? 'Обложка будет удалена после сохранения.'
          : 'JPG, PNG или WebP до 1,5 МБ. Горизонтальное изображение размещается во всю ширину страницы мероприятия.';
      }
    }

    function updateSubmitState(){
      submitButton.disabled = pendingReads > 0;
    }

    function setError(name, message){
      const wrapper = form.querySelector(`[data-field="${name}"]`);
      const error = form.querySelector(`[data-error-for="${name}"]`);
      if(!wrapper || !error) return;

      wrapper.classList.toggle('is-invalid', Boolean(message));
      error.textContent = message || '';
      error.hidden = !message;
      fields[name]?.setAttribute('aria-invalid', String(Boolean(message)));
    }

    function clearErrors(){
      ['title', 'type', 'level', 'date'].forEach(name => setError(name, ''));
    }

    function updateDateHint(){
      const value = fields.date.value;
      const isPast = Boolean(value) && value < todayKey();
      dateHint.hidden = !isPast;
      dateHint.textContent = isPast ? 'Дата в прошлом: мероприятие попадёт в раздел «Прошедшие».' : '';
    }

    function snapshot(){
      return JSON.stringify({
        title: fields.title.value.trim(),
        type: fields.type.value,
        level: fields.level.value,
        date: fields.date.value,
        time: fields.time.value,
        location: fields.location.value.trim(),
        signer: fields.signer.value.trim(),
        description: fields.description.value.trim(),
        hidden: fields.descriptionHidden.checked,
        people: [...ROLE_KEYS, 'staff'].map(role => pickers[role].getValues().map(person => normalizeName(person.name))),
        order: files.order.draft ? `new:${files.order.draft.name}` : (files.order.removed ? 'removed' : 'keep'),
        cover: files.cover.draft ? 'new' : (files.cover.removed ? 'removed' : 'keep')
      });
    }

    function isDirty(){
      return snapshot() !== baseline;
    }

    function syncSelect(select){
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function resetForm(){
      form.reset();
      clearErrors();
      fields.description.disabled = false;
      Object.values(pickers).forEach(picker => picker.clear());
      files.order = { current: null, draft: null, removed: false };
      files.cover = { current: '', draft: '', removed: false };
      orderInput.value = '';
      coverInput.value = '';
      pendingReads = 0;
      updateSubmitState();
      syncSelect(fields.type);
      syncSelect(fields.level);
      renderOrder();
      renderCover();
      updateDateHint();
    }

    function fillForm(event){
      fields.title.value = event.title || event.name || '';
      fields.type.value = event.type || '';
      fields.level.value = event.level || '';
      fields.date.value = event.date || event.dateISO || '';
      fields.time.value = event.time || '';
      fields.location.value = event.location || '';
      fields.signer.value = event.signer || '';
      fields.description.value = event.description || '';
      fields.descriptionHidden.checked = Boolean(event.descriptionHidden);
      fields.description.disabled = fields.descriptionHidden.checked;
      syncSelect(fields.type);
      syncSelect(fields.level);

      const roles = getRoles(event);
      ROLE_KEYS.forEach(role => pickers[role].setValues(roles[role]));
      pickers.staff.setValues(Array.isArray(event.staff) ? event.staff : []);

      files.order.current = event.orderFile || null;
      files.cover.current = event.cover || '';
      renderOrder();
      renderCover();
      updateDateHint();
    }

    function openDrawer(eventId){
      refreshDirectory();
      lastFocus = document.activeElement;
      editingId = eventId || null;
      resetForm();

      const existing = editingId ? readEvents().find(event => event.id === editingId) : null;

      if(editingId && !existing){
        notify('error', 'Мероприятие не найдено. Возможно, его уже удалили.', section);
        editingId = null;
        renderList();
        return;
      }

      if(existing){
        fillForm(existing);
        drawerKicker.textContent = 'РЕДАКТИРОВАНИЕ';
        drawerTitle.textContent = existing.title || existing.name || 'Мероприятие';
        submitButton.textContent = 'Сохранить изменения';
        status.textContent = `Дата: ${formatLongDate(existing.date)}`;
      }else{
        drawerKicker.textContent = 'НОВОЕ МЕРОПРИЯТИЕ';
        drawerTitle.textContent = 'Создание мероприятия';
        submitButton.textContent = 'Создать мероприятие';
        status.textContent = 'Поля со звёздочкой обязательны.';
      }

      deleteButton.hidden = !existing;
      baseline = snapshot();
      isOpen = true;

      drawer.setAttribute('aria-hidden', 'false');
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('admin-drawer-open');
      drawer.querySelector('.admin-drawer-body').scrollTop = 0;
      window.setTimeout(() => fields.title.focus(), 60);
    }

    function closeDrawer(){
      isOpen = false;
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('admin-drawer-open');
      if(lastFocus instanceof HTMLElement && document.contains(lastFocus)) lastFocus.focus();
    }

    async function requestClose(){
      if(!isOpen) return;

      if(isDirty()){
        const confirmed = await window.StudDialog.confirm({
          title: 'Закрыть без сохранения?',
          text: 'Изменения в форме не будут сохранены.',
          confirmLabel: 'Закрыть',
          cancelLabel: 'Продолжить редактирование'
        });
        if(!confirmed) return;
      }

      closeDrawer();
    }

    function focusInvalid(name){
      const control = fields[name];
      const trigger = control.closest('.custom-select')?.querySelector('.custom-select-trigger');
      const target = trigger || control;
      target.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
      target.focus({ preventScroll: true });
    }

    function validate(){
      clearErrors();
      let firstInvalid = '';

      const checks = [
        ['title', !fields.title.value.trim(), 'Укажите название мероприятия.'],
        ['type', !fields.type.value, 'Выберите тип мероприятия.'],
        ['level', !fields.level.value, 'Выберите уровень мероприятия.'],
        ['date', !parseDate(fields.date.value), 'Укажите дату мероприятия.']
      ];

      checks.forEach(([name, failed, message]) => {
        if(!failed) return;
        setError(name, message);
        if(!firstInvalid) firstInvalid = name;
      });

      return firstInvalid;
    }

    function newId(){
      return `calendar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function buildRecord(existing){
      const record = {
        ...(existing || {}),
        id: existing?.id || newId(),
        title: fields.title.value.trim(),
        type: fields.type.value,
        level: fields.level.value,
        date: fields.date.value,
        dateISO: fields.date.value,
        time: fields.time.value,
        location: fields.location.value.trim(),
        signer: fields.signer.value.trim(),
        description: fields.description.value.trim(),
        descriptionHidden: fields.descriptionHidden.checked,
        cover: effectiveCover(),
        orderFile: effectiveOrder(),
        roles: Object.fromEntries(ROLE_KEYS.map(role => [role, pickers[role].getValues()])),
        staff: pickers.staff.getValues()
      };

      delete record.studentsByRole;
      delete record.students;
      delete record.name;
      return record;
    }

    function ensureVisible(record){
      const isPast = Boolean(record.date) && record.date < todayKey();
      if(state.period !== 'all') state.period = isPast ? 'past' : 'upcoming';

      const query = normalizeName(state.query);
      const haystack = normalizeName(`${record.title} ${record.location} ${record.signer}`);
      if(state.type && state.type !== record.type) state.type = '';
      if(query && !haystack.includes(query)) state.query = '';

      searchInput.value = state.query;
      typeFilter.value = state.type;
      syncSelect(typeFilter);
    }

    function saveEvent(){
      const events = readEvents();
      const index = editingId ? events.findIndex(event => event.id === editingId) : -1;
      const existing = index >= 0 ? events[index] : null;

      if(editingId && !existing){
        notify('error', 'Мероприятие уже удалено и не может быть сохранено.', drawer);
        return;
      }

      const record = buildRecord(existing);

      if(existing) events[index] = record;
      else events.push(record);

      if(!writeEvents(events)){
        notify('error', 'Не удалось сохранить: хранилище браузера переполнено. Прикрепите файл или обложку меньшего размера.', drawer);
        return;
      }

      announceChange();
      closeDrawer();
      ensureVisible(record);
      highlightId = record.id;
      renderList();
      notify('success', existing ? `Изменения мероприятия «${record.title}» сохранены.` : `Мероприятие «${record.title}» создано.`, section);
    }

    async function deleteEvent(id){
      const events = readEvents();
      const target = events.find(event => event.id === id);
      if(!target) return false;

      const confirmed = await window.StudDialog.confirm({
        title: 'Удалить мероприятие?',
        text: `«${target.title || target.name || 'Мероприятие'}» · ${formatLongDate(target.date)}\nВместе с ним удалятся обложка, приказ и списки участников. Действие нельзя отменить.`,
        confirmLabel: 'Удалить'
      });

      if(!confirmed) return false;

      const remaining = readEvents().filter(event => event.id !== id);
      if(!writeEvents(remaining)){
        notify('error', 'Не удалось удалить мероприятие в этом браузере.', section);
        return false;
      }

      announceChange();
      renderList();
      notify('success', `Мероприятие «${target.title || target.name || 'Мероприятие'}» удалено.`, section);
      return true;
    }

    function peopleCount(event){
      return Object.values(getRoles(event)).reduce((sum, people) => sum + people.length, 0);
    }

    function compareEvents(a, b){
      return `${a.date || ''} ${a.time || ''}`.localeCompare(`${b.date || ''} ${b.time || ''}`);
    }

    function matchesFilters(event){
      if(state.type && event.type !== state.type) return false;

      const query = normalizeName(state.query);
      if(query){
        const haystack = normalizeName(`${event.title || event.name || ''} ${event.location || ''} ${event.signer || ''}`);
        if(!haystack.includes(query)) return false;
      }

      return true;
    }

    function isUpcoming(event, today){
      return Boolean(event.date) && event.date >= today;
    }

    function isPastEvent(event, today){
      return Boolean(event.date) && event.date < today;
    }

    function createRow(event, today){
      const item = el('li', 'admin-event-row');
      item.dataset.id = event.id;
      if(isPastEvent(event, today)) item.classList.add('is-past');
      if(event.id === highlightId) item.classList.add('is-highlighted');

      const dateBox = el('div', 'admin-event-date');
      const date = parseDate(event.date);
      if(date){
        dateBox.appendChild(el('strong', '', String(date.getDate())));
        dateBox.appendChild(el('span', '', date.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')));
        dateBox.appendChild(el('small', '', String(date.getFullYear())));
      }else{
        dateBox.appendChild(el('span', '', 'без даты'));
      }

      const main = el('div', 'admin-event-main');
      const title = el('a', 'admin-event-title', event.title || event.name || 'Мероприятие');
      title.href = `./event.php?id=${encodeURIComponent(event.id)}`;
      main.appendChild(title);

      const tags = el('div', 'admin-event-tags');
      if(event.type){
        const typeTag = el('span', 'admin-tag', event.type);
        typeTag.dataset.type = event.type;
        tags.appendChild(typeTag);
      }
      if(event.level) tags.appendChild(el('span', 'admin-tag admin-tag-level', event.level));
      if(isPastEvent(event, today) && state.period === 'all') tags.appendChild(el('span', 'admin-tag admin-tag-muted', 'Прошло'));
      main.appendChild(tags);

      const count = peopleCount(event);
      const meta = [
        event.time,
        event.location,
        count ? `${count} ${plural(count, 'человек', 'человека', 'человек')}` : 'Участники не назначены'
      ].filter(Boolean);
      main.appendChild(el('p', 'admin-event-meta', meta.join(' · ')));

      const actions = el('div', 'admin-event-actions');
      const label = event.title || event.name || 'мероприятие';

      const edit = el('button', 'admin-row-button', 'Редактировать');
      edit.type = 'button';
      edit.dataset.action = 'edit';
      edit.setAttribute('aria-label', `Редактировать: ${label}`);

      const remove = el('button', 'admin-row-button admin-row-button-danger', 'Удалить');
      remove.type = 'button';
      remove.dataset.action = 'delete';
      remove.setAttribute('aria-label', `Удалить: ${label}`);

      actions.append(edit, remove);
      item.append(dateBox, main, actions);
      return item;
    }

    function renderEmpty(kind){
      emptyActions.replaceChildren();

      if(kind === 'none'){
        emptyTitle.textContent = 'Мероприятий пока нет';
        emptyText.textContent = 'Создайте первое мероприятие или загрузите демонстрационные данные, чтобы проверить календарь и страницы мероприятий.';

        const create = el('button', 'admin-button', 'Создать мероприятие');
        create.type = 'button';
        create.addEventListener('click', () => openDrawer());

        const demo = el('button', 'admin-button admin-button-secondary', 'Загрузить демо-данные');
        demo.type = 'button';
        demo.addEventListener('click', loadDemo);

        emptyActions.append(create, demo);
      }else{
        emptyTitle.textContent = 'Ничего не найдено';
        emptyText.textContent = 'Измените запрос или период, чтобы увидеть мероприятия.';

        const reset = el('button', 'admin-button admin-button-secondary', 'Сбросить фильтры');
        reset.type = 'button';
        reset.addEventListener('click', () => {
          state.query = '';
          state.type = '';
          state.period = 'all';
          searchInput.value = '';
          typeFilter.value = '';
          syncSelect(typeFilter);
          renderList();
        });

        emptyActions.appendChild(reset);
      }

      emptyBox.hidden = false;
    }

    function renderList(){
      const all = readEvents();
      const today = todayKey();

      const base = all.filter(matchesFilters);
      const counts = {
        upcoming: base.filter(event => isUpcoming(event, today)).length,
        past: base.filter(event => isPastEvent(event, today)).length,
        all: base.length
      };

      section.querySelectorAll('[data-count]').forEach(node => {
        node.textContent = String(counts[node.dataset.count]);
      });

      periodButtons.forEach(button => {
        const active = button.dataset.period === state.period;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      let visible;
      if(state.period === 'upcoming'){
        visible = base.filter(event => isUpcoming(event, today)).sort(compareEvents);
      }else if(state.period === 'past'){
        visible = base.filter(event => isPastEvent(event, today)).sort((a, b) => compareEvents(b, a));
      }else{
        const upcoming = base.filter(event => isUpcoming(event, today)).sort(compareEvents);
        const past = base.filter(event => !isUpcoming(event, today)).sort((a, b) => compareEvents(b, a));
        visible = [...upcoming, ...past];
      }

      listElement.replaceChildren(...visible.map(event => createRow(event, today)));
      listElement.hidden = visible.length === 0;
      emptyBox.hidden = true;

      if(!all.length){
        summary.textContent = '';
        renderEmpty('none');
      }else if(!visible.length){
        summary.textContent = '';
        renderEmpty('filtered');
      }else{
        summary.textContent = `Показано ${visible.length} из ${all.length}`;
      }

      if(highlightId){
        const row = listElement.querySelector(`[data-id="${CSS.escape(highlightId)}"]`);
        row?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
        window.clearTimeout(highlightTimer);
        highlightTimer = window.setTimeout(() => row?.classList.remove('is-highlighted'), 2400);
        highlightId = '';
      }
    }

    function loadDemo(){
      const events = readEvents();
      const existingIds = new Set(events.map(event => event.id));
      const added = DEMO_EVENTS.filter(event => !existingIds.has(event.id));

      added.forEach(event => events.push({ ...event, dateISO: event.date, cover: '', orderFile: null, descriptionHidden: false }));

      if(!added.length){
        notify('warning', 'Демонстрационные мероприятия уже добавлены.', section);
        return;
      }

      if(!writeEvents(events)){
        notify('error', 'Не удалось сохранить демонстрационные данные в этом браузере.', section);
        return;
      }

      announceChange();
      state.query = '';
      state.type = '';
      state.period = 'all';
      searchInput.value = '';
      typeFilter.value = '';
      syncSelect(typeFilter);
      renderList();
      notify('success', `Добавлено демонстрационных мероприятий: ${added.length}.`, section);
    }

    createButton.addEventListener('click', () => openDrawer());

    listElement.addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if(!button) return;

      const id = button.closest('.admin-event-row')?.dataset.id;
      if(!id) return;

      if(button.dataset.action === 'edit') openDrawer(id);
      else deleteEvent(id);
    });

    searchInput.addEventListener('input', () => {
      state.query = searchInput.value;
      renderList();
    });

    typeFilter.addEventListener('change', () => {
      state.type = typeFilter.value;
      renderList();
    });

    periodButtons.forEach(button => {
      button.addEventListener('click', () => {
        state.period = button.dataset.period;
        renderList();
      });
    });

    closeButton.addEventListener('click', requestClose);
    cancelButton.addEventListener('click', requestClose);
    overlay.addEventListener('click', requestClose);

    deleteButton.addEventListener('click', async () => {
      if(!editingId) return;
      const deleted = await deleteEvent(editingId);
      if(deleted) closeDrawer();
    });

    document.addEventListener('keydown', event => {
      if(!isOpen) return;

      if(event.key === 'Escape'){
        if(event.defaultPrevented || document.querySelector('.stud-dialog.open, .custom-select.open')) return;
        event.preventDefault();
        requestClose();
        return;
      }

      if(event.key !== 'Tab') return;

      const focusable = Array.from(drawer.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), a[href]'))
        .filter(node => node.tabIndex !== -1 && !node.closest('[hidden]'));
      if(!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if(event.shiftKey && document.activeElement === first){
        event.preventDefault();
        last.focus();
      }else if(!event.shiftKey && document.activeElement === last){
        event.preventDefault();
        first.focus();
      }
    });

    fields.descriptionHidden.addEventListener('change', () => {
      fields.description.disabled = fields.descriptionHidden.checked;
    });

    fields.date.addEventListener('input', () => {
      updateDateHint();
      if(parseDate(fields.date.value)) setError('date', '');
    });

    fields.title.addEventListener('input', () => {
      if(fields.title.value.trim()) setError('title', '');
    });

    [fields.type, fields.level].forEach(select => {
      select.addEventListener('change', () => {
        if(select.value) setError(select === fields.type ? 'type' : 'level', '');
      });
    });

    orderInput.addEventListener('change', async () => {
      const file = orderInput.files?.[0];
      if(!file) return;

      if(!['pdf', 'doc', 'docx'].includes(extOf(file.name))){
        orderInput.value = '';
        notify('warning', 'Выберите файл в формате PDF, DOC или DOCX.', drawer);
        return;
      }

      if(file.size > MAX_ORDER_SIZE){
        orderInput.value = '';
        notify('warning', 'Размер файла не должен превышать 2,5 МБ.', drawer);
        return;
      }

      pendingReads++;
      updateSubmitState();

      try{
        const url = await readFileAsDataUrl(file);
        files.order.draft = { name: file.name, size: formatSize(file.size), ext: badgeExt(file.name), url };
        files.order.removed = false;
        renderOrder();
      }catch(error){
        orderInput.value = '';
        notify('error', error.message, drawer);
      }finally{
        pendingReads--;
        updateSubmitState();
      }
    });

    orderRemove.addEventListener('click', () => {
      files.order.draft = null;
      files.order.removed = Boolean(files.order.current);
      orderInput.value = '';
      renderOrder();
    });

    coverInput.addEventListener('change', async () => {
      const file = coverInput.files?.[0];
      if(!file) return;

      if(!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)){
        coverInput.value = '';
        notify('warning', 'Выберите изображение в формате JPG, PNG или WebP.', drawer);
        return;
      }

      if(file.size > MAX_COVER_SIZE){
        coverInput.value = '';
        notify('warning', 'Размер обложки не должен превышать 1,5 МБ.', drawer);
        return;
      }

      pendingReads++;
      updateSubmitState();

      try{
        files.cover.draft = await readFileAsDataUrl(file);
        files.cover.removed = false;
        renderCover();
      }catch(error){
        coverInput.value = '';
        notify('error', error.message, drawer);
      }finally{
        pendingReads--;
        updateSubmitState();
      }
    });

    coverRemove.addEventListener('click', () => {
      files.cover.draft = '';
      files.cover.removed = Boolean(files.cover.current);
      coverInput.value = '';
      renderCover();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      if(pendingReads > 0) return;

      const invalid = validate();
      if(invalid){
        status.textContent = 'Заполните обязательные поля.';
        notify('warning', 'Проверьте обязательные поля мероприятия.', drawer);
        focusInvalid(invalid);
        return;
      }

      saveEvent();
    });

    window.addEventListener('storage', event => {
      if(event.key === STORAGE_KEY) renderList();
    });
    window.addEventListener('studEvents:updated', renderList);

    refreshDirectory();
    renderList();
  }

  function initializeTabs(){
    const links = Array.from(document.querySelectorAll('.admin-nav a[href^="#"]'));
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    if(!links.length || !sections.length) return;

    function show(id){
      const target = sections.some(section => section.id === id) ? id : sections[0].id;

      sections.forEach(section => {
        section.hidden = section.id !== target;
      });

      links.forEach(link => {
        const active = link.getAttribute('href') === `#${target}`;
        link.classList.toggle('admin-nav-active', active);
        if(active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }

    links.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const id = link.getAttribute('href').slice(1);
        history.replaceState(null, '', `#${id}`);
        show(id);
      });
    });

    window.addEventListener('hashchange', () => show(location.hash.slice(1)));
    show(location.hash.slice(1));
  }

  function initializeStudentFormFeedback(){
    const form = document.querySelector('#adminStudentForm');
    const checkButton = document.querySelector('#adminStudentCheck');
    const status = document.querySelector('#adminStudentStatus');
    if(!form || !checkButton || !status) return;

    checkButton.addEventListener('click', () => {
      const missingField = Array.from(form.querySelectorAll('[required]')).some(field => !field.value.trim());
      const password = form.querySelector('[name="register_password"]').value;
      const confirmation = form.querySelector('[name="confirm_password"]').value;
      const section = form.closest('.admin-section');

      status.className = 'admin-form-status';
      if(missingField){
        status.textContent = 'Заполните все обязательные поля.';
        status.classList.add('admin-form-status-error');
        notify('error', 'Не заполнено одно или несколько обязательных полей.', section);
        return;
      }

      if(password !== confirmation){
        status.textContent = 'Пароли не совпадают.';
        status.classList.add('admin-form-status-error');
        notify('error', 'Пароль и подтверждение должны совпадать.', section);
        return;
      }

      if(/^\d+$/.test(password)){
        status.textContent = 'Пароль состоит только из цифр. Добавьте буквы.';
        status.classList.add('admin-form-status-warning');
        notify('warning', 'Пароль состоит только из цифр. Добавьте буквы.', section);
        return;
      }

      status.textContent = 'Проверка пройдена: обязательные поля заполнены.';
      status.classList.add('admin-form-status-success');
      notify('success', 'Все обязательные поля заполнены, форма выглядит корректно.', section);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initializeEvents();
    initializeTabs();
    initializeStudentFormFeedback();
  });
})();
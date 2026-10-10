(function(){
  function initializePicker(picker){
    const search = picker.querySelector('.admin-picker-search');
    const toggle = picker.querySelector('.admin-picker-toggle');
    const menu = picker.querySelector('.admin-picker-menu');
    const emptyState = picker.querySelector('.admin-picker-empty');
    const selectedContainer = picker.querySelector('.admin-picker-selected');
    const options = Array.from(picker.querySelectorAll('.admin-picker-option'));
    const selected = new Map();

    function setOpen(isOpen){
      menu.hidden = !isOpen;
      picker.classList.toggle('is-open', isOpen);
      search.setAttribute('aria-expanded', String(isOpen));
    }

    function getVisibleOptions(){
      return options.filter(option => !option.hidden);
    }

    function showResults(){
      const query = search.value.trim().toLocaleLowerCase('ru');
      let visibleCount = 0;

      options.forEach(option => {
        const text = (option.dataset.search || option.textContent).toLocaleLowerCase('ru');
        option.hidden = !text.includes(query);
        if(!option.hidden) visibleCount++;
      });

      emptyState.hidden = visibleCount > 0;
      setOpen(true);
    }

    function renderSelected(){
      selectedContainer.replaceChildren();

      selected.forEach((option, value) => {
        const chip = document.createElement('span');
        chip.className = 'admin-picker-chip';

        const label = document.createElement('span');
        label.textContent = option.textContent.trim();

        const remove = document.createElement('button');
        remove.className = 'admin-picker-chip-remove';
        remove.type = 'button';
        remove.setAttribute('aria-label', `Удалить: ${option.textContent.trim()}`);
        remove.innerHTML = '<span aria-hidden="true">&times;</span>';
        remove.addEventListener('click', () => {
          selected.delete(value);
          option.setAttribute('aria-selected', 'false');
          renderSelected();
          showResults();
          search.focus();
        });

        const hiddenValue = document.createElement('input');
        hiddenValue.type = 'hidden';
        hiddenValue.name = picker.dataset.fieldName;
        hiddenValue.value = value;

        chip.append(label, remove, hiddenValue);
        selectedContainer.appendChild(chip);
      });

      selectedContainer.hidden = selected.size === 0;
    }

    function toggleOption(option){
      const value = option.dataset.value;
      if(selected.has(value)) selected.delete(value);
      else selected.set(value, option);

      option.setAttribute('aria-selected', String(selected.has(value)));
      renderSelected();
      search.focus();
    }

    picker.adminPeoplePicker = {
      clear(){
        selected.forEach(option => option.setAttribute('aria-selected', 'false'));
        selected.clear();
        renderSelected();
      },
      getValues(){
        return Array.from(selected.keys());
      },
      setValues(values){
        selected.clear();
        options.forEach(option => {
          const isSelected = values.includes(option.dataset.value);
          option.setAttribute('aria-selected', String(isSelected));
          if(isSelected) selected.set(option.dataset.value, option);
        });
        renderSelected();
      }
    };

    search.addEventListener('focus', showResults);
    search.addEventListener('input', showResults);
    search.addEventListener('keydown', event => {
      if(event.key === 'Escape'){
        setOpen(false);
      }else if(event.key === 'ArrowDown' || event.key === 'ArrowUp'){
        event.preventDefault();
        showResults();
        const visibleOptions = getVisibleOptions();
        const target = event.key === 'ArrowDown' ? visibleOptions[0] : visibleOptions[visibleOptions.length - 1];
        target?.focus();
      }else if(event.key === 'Enter' && menu.hidden === false){
        const visibleOptions = getVisibleOptions();
        if(search.value.trim() && visibleOptions.length === 1){
          event.preventDefault();
          toggleOption(visibleOptions[0]);
        }
      }
    });

    options.forEach(option => {
      option.addEventListener('click', () => toggleOption(option));
      option.addEventListener('keydown', event => {
        const visibleOptions = getVisibleOptions();
        const currentIndex = visibleOptions.indexOf(option);

        if(event.key === 'Escape'){
          event.preventDefault();
          setOpen(false);
          search.focus();
        }else if(event.key === 'ArrowDown' || event.key === 'ArrowUp'){
          event.preventDefault();
          const direction = event.key === 'ArrowDown' ? 1 : -1;
          const nextIndex = (currentIndex + direction + visibleOptions.length) % visibleOptions.length;
          visibleOptions[nextIndex]?.focus();
        }else if(event.key === 'Home'){
          event.preventDefault();
          visibleOptions[0]?.focus();
        }else if(event.key === 'End'){
          event.preventDefault();
          visibleOptions[visibleOptions.length - 1]?.focus();
        }
      });
    });

    toggle.addEventListener('click', () => {
      if(menu.hidden){
        showResults();
        search.focus();
      }else{
        setOpen(false);
      }
    });

    document.addEventListener('click', event => {
      if(!picker.contains(event.target)) setOpen(false);
    });
  }

  function initializeEventManagement(){
    const form = document.querySelector('#adminEventForm');
    if(!form) return;

    const eventSelect = document.querySelector('#adminEventSelect');
    const newButton = document.querySelector('#adminNewEvent');
    const editButton = document.querySelector('#adminEditEvent');
    const deleteButton = document.querySelector('#adminDeleteEvent');
    const submitButton = document.querySelector('#adminEventSubmit');
    const title = document.querySelector('#adminEventsTitle');
    const status = document.querySelector('#adminEventStatus');
    const documentHint = document.querySelector('#adminDocumentHint');
    const peoplePickers = Array.from(form.querySelectorAll('[data-admin-people-picker]'));
    let editingId = null;
    let events = [
      {
        id: 'event-1',
        name: 'Хахатон',
        type: 'Научное',
        location: 'Главный корпус',
        date: '2027-08-12',
        time: '14:00',
        description: 'Хакатон для студентов и школьников.',
        students: ['student-1', 'student-3'],
        staff: ['staff-1'],
        document: 'Приказ о проведении хахатона.pdf'
      },
      {
        id: 'event-2',
        name: 'День открытых дверей',
        type: 'Общественное',
        location: 'Главный корпус',
        date: '2026-09-01',
        time: '10:00',
        description: 'Знакомство абитуриентов с университетом.',
        students: ['student-2'],
        staff: ['staff-2', 'staff-3'],
        document: 'Приказ о проведении дня открытых дверей.pdf'
      },
      {
        id: 'event-3',
        name: 'Погружение',
        type: 'Городское',
        location: 'Университетский кампус',
        date: '2026-08-25',
        time: '16:30',
        description: 'Мероприятие для знакомства и сплочения студентов.',
        students: ['student-4', 'student-5'],
        staff: ['staff-4'],
        document: ''
      }
    ];

    function getField(name){
      return form.elements.namedItem(name);
    }

    function refreshManagedEvents(selectedId = ''){
      const placeholder = eventSelect.options[0];
      eventSelect.replaceChildren(placeholder);
      events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = `${event.name} · ${new Date(`${event.date}T00:00:00`).toLocaleDateString('ru-RU')}`;
        eventSelect.appendChild(option);
      });
      eventSelect.value = selectedId;
      eventSelect.dispatchEvent(new Event('change', { bubbles: true }));
      const picker = eventSelect.closest('.custom-select')?.querySelector('.custom-select-trigger');
      if(picker) picker.setAttribute('aria-label', eventSelect.selectedOptions[0]?.textContent || 'Выберите мероприятие');
      editButton.disabled = !eventSelect.value;
      deleteButton.disabled = !eventSelect.value;
    }

    function resetForm(){
      form.reset();
      peoplePickers.forEach(picker => picker.adminPeoplePicker?.clear());
      const type = getField('event_type');
      type.dispatchEvent(new Event('change', { bubbles: true }));
      documentHint.textContent = 'При редактировании можно выбрать новый файл, чтобы заменить текущий.';
    }

    function startCreate(){
      editingId = null;
      eventSelect.value = '';
      eventSelect.dispatchEvent(new Event('change', { bubbles: true }));
      editButton.disabled = true;
      deleteButton.disabled = true;
      resetForm();
      title.textContent = 'Новое мероприятие';
      submitButton.textContent = 'Создать мероприятие';
      status.textContent = 'Заполните поля, чтобы создать мероприятие.';
    }

    function startEdit(){
      const event = events.find(item => item.id === eventSelect.value);
      if(!event) return;

      editingId = event.id;
      resetForm();
      getField('event_name').value = event.name;
      getField('event_type').value = event.type;
      getField('event_type').dispatchEvent(new Event('change', { bubbles: true }));
      getField('event_location').value = event.location;
      getField('event_date').value = event.date;
      getField('event_time').value = event.time;
      getField('event_description').value = event.description;
      peoplePickers.find(picker => picker.dataset.fieldName === 'students[]')?.adminPeoplePicker?.setValues(event.students);
      peoplePickers.find(picker => picker.dataset.fieldName === 'staff[]')?.adminPeoplePicker?.setValues(event.staff);
      documentHint.textContent = event.document
        ? `Текущий документ: ${event.document}. Выберите файл, чтобы заменить его.`
        : 'Для мероприятия пока не прикреплён документ.';
      title.textContent = 'Редактирование мероприятия';
      submitButton.textContent = 'Сохранить изменения';
      status.textContent = `Редактируется: ${event.name}`;
    }

    eventSelect.addEventListener('change', () => {
      editButton.disabled = !eventSelect.value;
      deleteButton.disabled = !eventSelect.value;
    });
    newButton.addEventListener('click', startCreate);
    editButton.addEventListener('click', startEdit);
    deleteButton.addEventListener('click', () => {
      const event = events.find(item => item.id === eventSelect.value);
      if(!event || !window.confirm(`Удалить мероприятие «${event.name}»?`)) return;

      events = events.filter(item => item.id !== event.id);
      refreshManagedEvents();
      if(editingId === event.id) startCreate();
      status.textContent = `Мероприятие «${event.name}» удалено.`;
      window.showOperationFeedback?.('success', `Мероприятие «${event.name}» удалено.`, document.querySelector('#events'));
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      if(!form.reportValidity()){
        window.showOperationFeedback?.('warning', 'Проверьте обязательные поля мероприятия.', form.closest('.admin-section'));
        return;
      }

      const values = new FormData(form);
      const currentFile = values.get('event_document');
      const existing = events.find(item => item.id === editingId);
      const record = {
        id: editingId || `event-${Date.now()}`,
        name: values.get('event_name').trim(),
        type: values.get('event_type'),
        location: values.get('event_location').trim(),
        date: values.get('event_date'),
        time: values.get('event_time'),
        description: values.get('event_description').trim(),
        students: peoplePickers.find(picker => picker.dataset.fieldName === 'students[]')?.adminPeoplePicker?.getValues() || [],
        staff: peoplePickers.find(picker => picker.dataset.fieldName === 'staff[]')?.adminPeoplePicker?.getValues() || [],
        document: currentFile instanceof File && currentFile.name ? currentFile.name : existing?.document || ''
      };

      if(existing){
        events = events.map(item => item.id === existing.id ? record : item);
        status.textContent = `Изменения мероприятия «${record.name}» сохранены.`;
        window.showOperationFeedback?.('success', `Изменения мероприятия «${record.name}» сохранены.`, form.closest('.admin-section'));
      }else{
        events.push(record);
        status.textContent = `Мероприятие «${record.name}» добавлено.`;
        window.showOperationFeedback?.('success', `Мероприятие «${record.name}» добавлено.`, form.closest('.admin-section'));
      }

      editingId = record.id;
      refreshManagedEvents(record.id);
      title.textContent = 'Редактирование мероприятия';
      submitButton.textContent = 'Сохранить изменения';
      documentHint.textContent = record.document
        ? `Текущий документ: ${record.document}. Выберите файл, чтобы заменить его.`
        : 'Для мероприятия пока не прикреплён документ.';
    });

    refreshManagedEvents();
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
        window.showOperationFeedback?.('error', 'Не заполнено одно или несколько обязательных полей.', section);
        return;
      }

      if(password !== confirmation){
        status.textContent = 'Пароли не совпадают.';
        status.classList.add('admin-form-status-error');
        window.showOperationFeedback?.('error', 'Пароль и подтверждение должны совпадать.', section);
        return;
      }

      if(/^\d+$/.test(password)){
        status.textContent = 'Пароль состоит только из цифр. Добавьте буквы.';
        status.classList.add('admin-form-status-warning');
        window.showOperationFeedback?.('warning', 'Пароль состоит только из цифр. Добавьте буквы.', section);
        return;
      }

      status.textContent = 'Проверка пройдена: обязательные поля заполнены.';
      status.classList.add('admin-form-status-success');
      window.showOperationFeedback?.('success', 'Все обязательные поля заполнены, форма выглядит корректно.', section);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-admin-people-picker]').forEach(initializePicker);
    initializeEventManagement();
    initializeStudentFormFeedback();
  });
})();
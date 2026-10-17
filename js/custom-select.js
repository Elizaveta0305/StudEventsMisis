(function(){
  function enhanceSelect(select){
    if(select.dataset.customSelect === 'ready') return;
    select.dataset.customSelect = 'ready';
    const selectStyle = getComputedStyle(select);

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    wrapper.style.width = '100%';
    const trigger = document.createElement('button');
    trigger.className = 'custom-select-trigger';
    trigger.type = 'button';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    if(parseFloat(selectStyle.minHeight) > 0){
      trigger.style.minHeight = selectStyle.minHeight;
    }
    trigger.style.width = '100%';
    const label = document.createElement('span');
    const arrow = document.createElement('span');
    arrow.className = 'custom-select-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    trigger.append(label, arrow);

    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    menu.setAttribute('role', 'listbox');
    const menuId = `${select.id || 'select'}Options`;
    menu.id = menuId;
    trigger.setAttribute('aria-controls', menuId);

    select.parentNode.insertBefore(wrapper, select);
    wrapper.append(select, trigger, menu);
    select.classList.add('custom-select-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    function close(){
      wrapper.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    function open(){
      document.querySelectorAll('.custom-select.open').forEach(openSelect => {
        if(openSelect !== wrapper){
          openSelect.classList.remove('open');
          openSelect.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });
      wrapper.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.querySelector('[aria-selected="true"]')?.focus();
    }

    function sync(){
      label.textContent = select.selectedOptions[0]?.textContent || '';
      menu.replaceChildren();
      Array.from(select.options).forEach((option, index) => {
        const item = document.createElement('button');
        item.className = 'custom-select-option';
        item.type = 'button';
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(index === select.selectedIndex));
        item.disabled = option.disabled;
        item.textContent = option.textContent;
        item.addEventListener('click', () => {
          select.selectedIndex = index;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          sync();
          close();
          trigger.focus();
        });
        menu.appendChild(item);
      });
    }

    trigger.addEventListener('click', () => {
      if(wrapper.classList.contains('open')) close();
      else open();
    });

    trigger.addEventListener('keydown', event => {
      if(event.key === 'ArrowDown' || event.key === 'ArrowUp'){
        event.preventDefault();
        open();
      }
    });

    menu.addEventListener('keydown', event => {
      const items = [...menu.querySelectorAll('.custom-select-option:not(:disabled)')];
      const currentIndex = items.indexOf(document.activeElement);
      if(event.key === 'Escape'){
        event.preventDefault();
        close();
        trigger.focus();
      }else if(event.key === 'ArrowDown' || event.key === 'ArrowUp'){
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        items[(currentIndex + direction + items.length) % items.length]?.focus();
      }else if(event.key === 'Home'){
        event.preventDefault();
        items[0]?.focus();
      }else if(event.key === 'End'){
        event.preventDefault();
        items[items.length - 1]?.focus();
      }
    });

    select.addEventListener('change', sync);
    new MutationObserver(sync).observe(select, { childList: true, subtree: true, attributes: true });
    document.addEventListener('click', event => {
      if(!wrapper.contains(event.target)) close();
    });

    sync();
  }

  const groups = ['ИТ-23', 'АТ-24', 'ИТ-24', 'Э/Ц-23'];

  function normalize(value){
    return value.toLocaleUpperCase('ru').replace(/[\s\-._/]+/g, '');
  }

  function initGroupSearch(){
    const input = document.getElementById('group');
    if(!input) return;

    const wrap = document.createElement('div');
    wrap.className = 'group-search';
    const menu = document.createElement('div');
    menu.className = 'group-search-menu';
    menu.id = 'groupOptions';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    input.parentNode.insertBefore(wrap, input);
    wrap.append(input, menu);

    input.autocomplete = 'off';
    input.placeholder = 'Например, ИТ-23';
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', menu.id);
    input.setAttribute('aria-expanded', 'false');

    let activeIndex = -1;

    function availableGroups(){
      return groups;
    }

    function findGroup(value){
      const query = normalize(value);
      return query ? availableGroups().find(group => normalize(group) === query) : undefined;
    }

    function validate(){
      const value = input.value.trim();
      if(!value){
        input.setCustomValidity('');
        return;
      }
      input.setCustomValidity(findGroup(value) ? '' : 'Выберите группу из списка');
    }

    function closeMenu(){
      menu.hidden = true;
      activeIndex = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function selectGroup(group){
      input.value = group;
      validate();
      closeMenu();
    }

    function setActive(index){
      const items = [...menu.querySelectorAll('.group-search-option')];
      if(!items.length) return;
      activeIndex = (index + items.length) % items.length;
      items.forEach((item, itemIndex) => {
        const isActive = itemIndex === activeIndex;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', String(isActive));
        if(isActive){
          input.setAttribute('aria-activedescendant', item.id);
          item.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    function render(){
      const query = normalize(input.value);
      menu.replaceChildren();
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');
      if(!query){
        closeMenu();
        return;
      }
      const matches = availableGroups().filter(group => normalize(group).includes(query)).slice(0, 8);
      if(matches.length){
        matches.forEach((group, index) => {
          const option = document.createElement('button');
          option.className = 'group-search-option';
          option.type = 'button';
          option.id = `groupOption${index}`;
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', 'false');
          option.textContent = group;
          option.addEventListener('mousedown', event => event.preventDefault());
          option.addEventListener('click', () => {
            selectGroup(group);
            input.focus();
          });
          menu.appendChild(option);
        });
      }else{
        const empty = document.createElement('p');
        empty.className = 'group-search-empty';
        empty.textContent = 'Такой группы нет в списке';
        menu.appendChild(empty);
      }
      menu.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    input.addEventListener('input', () => {
      validate();
      render();
    });

    input.addEventListener('focus', () => {
      if(input.value.trim()) render();
    });

    input.addEventListener('blur', () => {
      window.setTimeout(() => {
        const exact = findGroup(input.value);
        if(exact) input.value = exact;
        validate();
        closeMenu();
      }, 120);
    });

    input.addEventListener('keydown', event => {
      if(event.key === 'ArrowDown' || event.key === 'ArrowUp'){
        event.preventDefault();
        if(menu.hidden) render();
        setActive(activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
      }else if(event.key === 'Enter'){
        const active = menu.querySelectorAll('.group-search-option')[activeIndex];
        const first = menu.querySelector('.group-search-option');
        const choice = active || (!menu.hidden ? first : null);
        if(choice){
          event.preventDefault();
          selectGroup(choice.textContent);
        }
      }else if(event.key === 'Escape' && !menu.hidden){
        event.preventDefault();
        closeMenu();
      }
    });

    input.form?.addEventListener('submit', event => {
      validate();
      if(!input.checkValidity()){
        event.preventDefault();
        input.reportValidity();
      }
    });
  }

  window.enhanceCustomSelect = enhanceSelect;

  document.addEventListener('DOMContentLoaded', () => {
    initGroupSearch();
    document.querySelectorAll('.select-field select, .faculty-analytics-faculty-control select, .faculty-analytics-period-control select, .student-analytics-period select, .settings-select, .auth-form select, .admin-field select:not([multiple]), .event-modal-form select:not([multiple])').forEach(enhanceSelect);
  });
})();
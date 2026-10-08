(function(){
  function enhanceSelect(select){
    if(select.dataset.customSelect === 'ready') return;
    select.dataset.customSelect = 'ready';
    const selectStyle = getComputedStyle(select);

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    wrapper.style.width = `${select.getBoundingClientRect().width}px`;
    wrapper.style.maxWidth = '100%';
    wrapper.style.height = selectStyle.height;
    const trigger = document.createElement('button');
    trigger.className = 'custom-select-trigger';
    trigger.type = 'button';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.style.minHeight = selectStyle.minHeight;
    trigger.style.width = '100%';
    trigger.style.height = '100%';
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

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.select-field select, .faculty-analytics-faculty-control select, .faculty-analytics-period-control select, .student-analytics-period select, .settings-select').forEach(enhanceSelect);
  });
})();
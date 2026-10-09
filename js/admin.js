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

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-admin-people-picker]').forEach(initializePicker);
  });
})();
(function(){
  function initUserDropdown(toggleSelector = '#userToggle', menuSelector = '.user-menu'){
    const userToggle = document.querySelector(toggleSelector);
    const userMenu = document.querySelector(menuSelector);
    if(!userToggle || !userMenu) return;

    userToggle.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      userMenu.classList.toggle('open');
    });

    document.addEventListener('click', function(event){
      if(!userMenu.contains(event.target) && !userToggle.contains(event.target)){
        userMenu.classList.remove('open');
      }
    });
  }

  function loadSiteTheme(){
    const saved = localStorage.getItem('siteTheme');
    if(saved === 'dark'){
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function initLogoutIconState(){
    const logoutItem = document.querySelector('.user-dropdown a.logout-link');
    if(!logoutItem) return;
    const logoutIcon = logoutItem.querySelector('.dropdown-icon img');
    if(!logoutIcon) return;

    let isHover = false;

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const applyState = () => {
      const dark = isDarkMode();
      if(isHover){
        if(dark){
          logoutItem.style.background = '#ffffff';
          logoutItem.style.color = '#111827';
          logoutIcon.style.filter = 'brightness(0) saturate(100%)';
        } else {
          logoutItem.style.background = '#fee2e2';
          logoutItem.style.color = '#b91c1c';
          logoutIcon.style.filter = 'none';
        }
      } else {
        logoutItem.style.background = 'transparent';
        if(dark){
          logoutItem.style.color = '#f8fafc';
          logoutIcon.style.filter = 'brightness(0) invert(1)';
        } else {
          logoutItem.style.color = '#111827';
          logoutIcon.style.filter = 'none';
        }
      }
    };

    logoutItem.addEventListener('mouseenter', () => {
      isHover = true;
      applyState();
    });
    logoutItem.addEventListener('mouseleave', () => {
      isHover = false;
      applyState();
    });

    const observer = new MutationObserver(applyState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    applyState();
  }

  function initDateInputBehavior(){
    const dateField = document.querySelector('.date-field');
    const dateInput = dateField ? dateField.querySelector('input[type="date"]') : null;
    const dateTrigger = dateField ? dateField.querySelector('.date-trigger') : null;
    if(!dateField || !dateInput || !dateTrigger) return;

    const openPicker = () => {
      dateInput.focus();
      if(typeof dateInput.showPicker === 'function'){
        dateInput.showPicker();
      } else {
        dateInput.click();
      }
    };

    dateTrigger.addEventListener('click', function(event){
      event.preventDefault();
      openPicker();
    });

    dateField.addEventListener('click', function(event){
      if(event.target === dateTrigger) return;
      if(event.target === dateInput) return;
      event.preventDefault();
      openPicker();
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    loadSiteTheme();
    initLogoutIconState();
    initDateInputBehavior();
    initUserDropdown('#userToggle', '.user-menu');
  });

  window.initUserDropdown = initUserDropdown;
})();

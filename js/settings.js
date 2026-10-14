(function(){
  const themeSelect = document.getElementById('themeSelect');

  function applyTheme(theme){
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }

  function loadTheme(){
    const saved = localStorage.getItem('siteTheme') || 'light';
    applyTheme(saved);
    if(themeSelect){
      themeSelect.value = saved;
    }
  }

  function saveTheme(theme){
    localStorage.setItem('siteTheme', theme);
  }

  if(themeSelect){
    themeSelect.addEventListener('change', function(){
      const selected = themeSelect.value;
      applyTheme(selected);
      saveTheme(selected);
    });
  }

  function initCalendarSettings(){
    const store = window.CalendarSettings;
    const weekStart = document.getElementById('calendarWeekStart');
    const timeFormat = document.getElementById('calendarTimeFormat');
    const showTime = document.getElementById('calendarShowTime');
    const showPlace = document.getElementById('calendarShowPlace');
    const typeChecks = [...document.querySelectorAll('[data-calendar-type]')];
    if(!store || !weekStart || !timeFormat || !showTime || !showPlace) return;

    const saved = store.load();
    weekStart.value = saved.weekStart;
    timeFormat.value = saved.timeFormat;
    showTime.checked = saved.showTime;
    showPlace.checked = saved.showPlace;
    typeChecks.forEach(check => {
      check.checked = !saved.hiddenTypes.includes(check.value);
    });

    weekStart.addEventListener('change', () => store.save({ weekStart: weekStart.value }));
    timeFormat.addEventListener('change', () => store.save({ timeFormat: timeFormat.value }));
    showTime.addEventListener('change', () => store.save({ showTime: showTime.checked }));
    showPlace.addEventListener('change', () => store.save({ showPlace: showPlace.checked }));
    typeChecks.forEach(check => {
      check.addEventListener('change', () => {
        store.save({
          hiddenTypes: typeChecks.filter(item => !item.checked).map(item => item.value)
        });
      });
    });

    const selectAllBtn = document.getElementById('selectAllTypes');
    const clearAllBtn = document.getElementById('clearAllTypes');

    if(selectAllBtn){
      selectAllBtn.addEventListener('click', () => {
        typeChecks.forEach(check => { check.checked = true; });
        store.save({ hiddenTypes: [] });
      });
    }

    if(clearAllBtn){
      clearAllBtn.addEventListener('click', () => {
        typeChecks.forEach(check => { check.checked = false; });
        store.save({ hiddenTypes: typeChecks.map(item => item.value) });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    loadTheme();
    initCalendarSettings();
  });
})();
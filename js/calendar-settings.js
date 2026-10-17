(function(){
  const storageKey = 'studEvents.calendarSettings.v1';
  const eventTypes = ['Научное', 'Общественное', 'Спортивное', 'Творческое'];
  const defaults = {
    weekStart: 'mon', 
    timeFormat: '24',
    showTime: true,
    showPlace: true,
    hiddenTypes: []
  };

  function load(){
    try{
      const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return {
        weekStart: stored.weekStart === 'sun' ? 'sun' : defaults.weekStart,
        timeFormat: stored.timeFormat === '12' ? '12' : defaults.timeFormat,
        showTime: typeof stored.showTime === 'boolean' ? stored.showTime : defaults.showTime,
        showPlace: typeof stored.showPlace === 'boolean' ? stored.showPlace : defaults.showPlace,
        hiddenTypes: Array.isArray(stored.hiddenTypes)
          ? stored.hiddenTypes.filter(type => eventTypes.includes(type))
          : []
      };
    }catch{
      return {...defaults, hiddenTypes: []};
    }
  }

  function save(partial){
    const next = {...load(), ...partial};
    try{
      localStorage.setItem(storageKey, JSON.stringify(next));
    }catch{
      
    }
    return next;
  }

  window.CalendarSettings = { storageKey, eventTypes, defaults, load, save };
})();
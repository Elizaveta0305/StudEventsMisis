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

  document.addEventListener('DOMContentLoaded', function(){
    loadTheme();
  });
})();

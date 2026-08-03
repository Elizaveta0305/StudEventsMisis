(function(){
  const themeLight = document.getElementById('themeLight');
  const themeDark = document.getElementById('themeDark');
  const themeToggleInputs = [themeLight, themeDark];

  function applyTheme(theme){
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }

  function loadTheme(){
    const saved = localStorage.getItem('siteTheme') || 'light';
    applyTheme(saved);
    if(saved === 'dark'){
      themeDark.checked = true;
    } else {
      themeLight.checked = true;
    }
  }

  function saveTheme(theme){
    localStorage.setItem('siteTheme', theme);
  }

  themeToggleInputs.forEach(input => {
    if(!input) return;
    input.addEventListener('change', () => {
      if(input.checked){
        applyTheme(input.value);
        saveTheme(input.value);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function(){
    loadTheme();
    if(window.initUserDropdown){
      window.initUserDropdown('#userToggle', '.user-menu');
    }
  });
})();
